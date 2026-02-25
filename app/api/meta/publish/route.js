import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Apply overrides from the overrides map to an items array.
 * overridesForLevel: { [index]: { field: value, ... } }
 */
function applyOverrides(items = [], overridesForLevel = {}) {
  return items.map((item, idx) => {
    const patch = overridesForLevel[idx] || overridesForLevel[String(idx)]
    if (!patch) return item
    return { ...item, ...patch }
  })
}

// POST /api/meta/publish — publish a draft venue to weekly_reports
// Body: { draft_id, venue_id }
export async function POST(req) {
  try {
    const body = await req.json()
    const { draft_id, venue_id } = body

    if (!draft_id || !venue_id) {
      return NextResponse.json({ error: 'draft_id and venue_id required' }, { status: 400 })
    }

    // Load the draft
    const { data: draft, error: draftErr } = await supabase
      .from('meta_sync_drafts')
      .select('*')
      .eq('id', draft_id)
      .single()

    if (draftErr) throw draftErr
    if (!draft) return NextResponse.json({ error: 'Draft not found' }, { status: 404 })

    const venueData  = draft.mapped_data?.[venue_id]
    if (!venueData) return NextResponse.json({ error: 'No data for this venue in draft' }, { status: 404 })

    const venueOverrides = draft.overrides?.[venue_id] || {}

    // Apply overrides to each level
    const finalCampaigns = applyOverrides(venueData.campaigns || [], venueOverrides.campaigns || {})
    const finalAdSets    = applyOverrides(venueData.adSets    || [], venueOverrides.adSets    || {})
    const finalAds       = applyOverrides(venueData.ads       || [], venueOverrides.ads       || {})

    // Strip internal Meta IDs from published output
    const stripIds = (arr) => arr.map(({ campaign_id, adset_id, ad_id, ...rest }) => rest)

    const finalMetaData = {
      campaigns: stripIds(finalCampaigns),
      adSets:    stripIds(finalAdSets),
      ads:       stripIds(finalAds),
    }

    // Calculate total spend from campaigns
    const totalSpend = finalCampaigns.reduce((sum, c) => sum + (parseFloat(c.spend) || 0), 0)

    const { week_start, week_end } = draft

    // Check if weekly_reports row exists for this venue + week
    const { data: existing } = await supabase
      .from('weekly_reports')
      .select('id')
      .eq('venue_id', venue_id)
      .eq('week_start', week_start)
      .eq('week_end', week_end)
      .maybeSingle()

    if (existing) {
      // UPDATE — preserve revenue/programmatic, only overwrite meta_data + ad_spend
      const { error: updateErr } = await supabase
        .from('weekly_reports')
        .update({
          meta_data: finalMetaData,
          ad_spend:  totalSpend,
        })
        .eq('id', existing.id)

      if (updateErr) throw updateErr
    } else {
      // INSERT new row (meta only — revenue/programmatic remain null until SQL entry)
      const { error: insertErr } = await supabase
        .from('weekly_reports')
        .insert({
          venue_id,
          week_start,
          week_end,
          meta_data: finalMetaData,
          ad_spend:  totalSpend,
        })

      if (insertErr) throw insertErr
    }

    // Mark draft as published (partial — per-venue)
    await supabase
      .from('meta_sync_drafts')
      .update({ published_at: new Date().toISOString() })
      .eq('id', draft_id)

    return NextResponse.json({
      success:      true,
      venue_id,
      week_start,
      week_end,
      ad_spend:     totalSpend,
      campaigns:    finalCampaigns.length,
      adSets:       finalAdSets.length,
      ads:          finalAds.length,
    })
  } catch (err) {
    console.error('[meta/publish POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
