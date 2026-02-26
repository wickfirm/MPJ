import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import {
  fetchMetaInsights,
  fetchMetaObjectStatuses,
  normalizeCampaign,
  normalizeAdSet,
  normalizeAd,
  mapToVenues,
} from '@/lib/meta-api'

const CAMPAIGN_FIELDS = 'campaign_id,campaign_name,impressions,clicks,spend,reach,ctr,actions'
const ADSET_FIELDS    = 'campaign_id,adset_id,adset_name,impressions,clicks,spend,reach,ctr,actions'
const AD_FIELDS       = 'campaign_id,adset_id,ad_id,ad_name,impressions,clicks,spend,reach,ctr,actions'

// POST /api/meta/sync — fetch from Meta API and save as draft
// Body: { week_start: 'YYYY-MM-DD', week_end: 'YYYY-MM-DD' }
export async function POST(req) {
  try {
    const body = await req.json()
    const { week_start, week_end } = body

    if (!week_start || !week_end) {
      return NextResponse.json({ error: 'week_start and week_end required' }, { status: 400 })
    }

    const token       = process.env.META_ACCESS_TOKEN
    const adAccountId = process.env.META_AD_ACCOUNT_ID

    if (!token || !adAccountId) {
      return NextResponse.json({ error: 'META_ACCESS_TOKEN or META_AD_ACCOUNT_ID not configured' }, { status: 500 })
    }

    const timeRange = { since: week_start, until: week_end }

    // Fetch insights (3 levels) + live statuses (3 object endpoints) in parallel
    const [rawCampaigns, rawAdSets, rawAds, campStatuses, adsetStatuses, adStatuses] = await Promise.all([
      fetchMetaInsights('campaign', CAMPAIGN_FIELDS, timeRange, token, adAccountId),
      fetchMetaInsights('adset',    ADSET_FIELDS,    timeRange, token, adAccountId),
      fetchMetaInsights('ad',       AD_FIELDS,       timeRange, token, adAccountId),
      fetchMetaObjectStatuses('campaigns', token, adAccountId),
      fetchMetaObjectStatuses('adsets',    token, adAccountId),
      fetchMetaObjectStatuses('ads',       token, adAccountId),
    ])

    // Normalize and merge live status + audience (adsets only)
    const campaigns = rawCampaigns.map(r => {
      const entry = campStatuses.get(r.campaign_id)
      return { ...normalizeCampaign(r), status: entry?.status || 'UNKNOWN' }
    })
    const adSets = rawAdSets.map(r => {
      const entry = adsetStatuses.get(r.adset_id)
      return { ...normalizeAdSet(r), status: entry?.status || 'UNKNOWN', ...(entry?.audience ? { audience: entry.audience } : {}) }
    })
    const ads = rawAds.map(r => {
      const entry = adStatuses.get(r.ad_id)
      return { ...normalizeAd(r), status: entry?.status || 'UNKNOWN' }
    })

    // Load existing campaign→venue mappings
    const { data: mappingRows, error: mappingErr } = await supabase
      .from('meta_campaign_mappings')
      .select('campaign_id, venue_id')

    if (mappingErr) throw mappingErr

    // Upsert any new campaigns into the mapping table (with null venue_id — admin will assign)
    const existingIds = new Set((mappingRows || []).map(m => m.campaign_id))
    const newMappings = campaigns
      .filter(c => !existingIds.has(c.campaign_id))
      .map(c => ({ campaign_id: c.campaign_id, campaign_name: c.name, venue_id: null }))

    if (newMappings.length > 0) {
      await supabase
        .from('meta_campaign_mappings')
        .upsert(newMappings, { onConflict: 'campaign_id' })
    }

    // Also update campaign names in case they changed
    const namesToUpdate = campaigns
      .filter(c => existingIds.has(c.campaign_id))
      .map(c => ({ campaign_id: c.campaign_id, campaign_name: c.name }))

    if (namesToUpdate.length > 0) {
      for (const n of namesToUpdate) {
        await supabase
          .from('meta_campaign_mappings')
          .update({ campaign_name: n.campaign_name, updated_at: new Date().toISOString() })
          .eq('campaign_id', n.campaign_id)
      }
    }

    // Re-load mappings with updated venue assignments
    const { data: freshMappings } = await supabase
      .from('meta_campaign_mappings')
      .select('campaign_id, venue_id')

    // Group by venue
    const mappedData = mapToVenues(campaigns, adSets, ads, freshMappings || [])
    const unmappedCount = mappedData.__unmapped__?.campaigns?.length || 0

    const rawData = { campaigns, adSets, ads }

    // Upsert draft (re-sync resets overrides intentionally)
    const { data: draft, error: draftErr } = await supabase
      .from('meta_sync_drafts')
      .upsert({
        week_start,
        week_end,
        raw_data:    rawData,
        mapped_data: mappedData,
        overrides:   {},
        status:      'draft',
        synced_at:   new Date().toISOString(),
      }, { onConflict: 'week_start,week_end' })
      .select('id')
      .single()

    if (draftErr) throw draftErr

    return NextResponse.json({
      draft_id:           draft.id,
      campaigns_fetched:  campaigns.length,
      adsets_fetched:     adSets.length,
      ads_fetched:        ads.length,
      unmapped_campaigns: unmappedCount,
    })
  } catch (err) {
    console.error('[meta/sync POST]', err)
    // Surface token expiry clearly
    if (err.metaCode === 190) {
      return NextResponse.json({ error: 'Meta access token expired. Please exchange a new token in Settings.' }, { status: 401 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
