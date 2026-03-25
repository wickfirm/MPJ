import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAdCreatives, fetchAdImagesByHash } from '@/lib/meta-api'
import { uploadToR2, generateR2Key } from '@/lib/r2'

export const maxDuration = 120 // Vercel function timeout (seconds)

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY
  )
}

// Process items in parallel batches
async function parallelBatch(items, fn, batchSize = 5) {
  const results = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(batch.map(fn))
    results.push(...batchResults)
  }
  return results
}

// POST /api/meta/creatives/sync
// Body: { venue_id: string | 'all', date_from?, date_to? }
export async function POST(req) {
  try {
    const { venue_id, date_from, date_to } = await req.json()
    if (!venue_id) {
      return NextResponse.json({ error: 'venue_id is required ("all" or a specific UUID)' }, { status: 400 })
    }

    const token = process.env.META_ACCESS_TOKEN
    const adAccountId = process.env.META_AD_ACCOUNT_ID
    if (!token || !adAccountId) {
      return NextResponse.json({ error: 'META_ACCESS_TOKEN or META_AD_ACCOUNT_ID not configured' }, { status: 500 })
    }

    const supabase = getSupabase()

    // Load campaign-venue mappings
    let mappingsQuery = supabase.from('meta_campaign_mappings').select('campaign_id, campaign_name, venue_id')
    if (venue_id !== 'all') {
      mappingsQuery = mappingsQuery.eq('venue_id', venue_id)
    } else {
      mappingsQuery = mappingsQuery.not('venue_id', 'is', null)
    }
    const { data: mappings, error: mapErr } = await mappingsQuery
    if (mapErr) throw new Error(`Failed to load mappings: ${mapErr.message}`)
    if (!mappings || mappings.length === 0) {
      return NextResponse.json({ error: 'No campaign-venue mappings found', synced: 0, skipped: 0 }, { status: 200 })
    }

    // Build venue lookup: campaign_id → venue_id
    const campToVenue = {}
    mappings.forEach(m => { campToVenue[m.campaign_id] = m.venue_id })
    const campaignIds = mappings.map(m => m.campaign_id)

    // Load venue names for R2 key generation
    const venueIds = [...new Set(Object.values(campToVenue))]
    const { data: venues } = await supabase.from('venues').select('id, name').in('id', venueIds)
    const venueNameMap = {}
    ;(venues || []).forEach(v => { venueNameMap[v.id] = v.name })

    // Fetch ads with creative hashes from Meta (with optional date filter)
    const adCreatives = await fetchAdCreatives(campaignIds, token, adAccountId, {
      dateFrom: date_from || null,
      dateTo: date_to || null,
    })

    // Collect all unique hashes AND direct URLs
    const allHashes = []
    const hashToAds = {}
    const directUrlAds = []
    for (const ad of adCreatives) {
      for (const h of (ad.image_hashes || [])) {
        if (!hashToAds[h.hash]) {
          hashToAds[h.hash] = []
          allHashes.push(h.hash)
        }
        hashToAds[h.hash].push({ ad_id: ad.ad_id, ad_name: ad.ad_name, campaign_id: ad.campaign_id, type: h.type, created_time: ad.created_time })
      }
      for (const u of (ad.image_urls || [])) {
        directUrlAds.push({ url: u.url, type: u.type, ad_id: ad.ad_id, ad_name: ad.ad_name, campaign_id: ad.campaign_id, created_time: ad.created_time })
      }
    }

    if (allHashes.length === 0 && directUrlAds.length === 0) {
      return NextResponse.json({ synced: 0, skipped: 0, errors: 0, message: 'No creatives found in Meta ads' })
    }

    // Dedup hashes
    let existingHashes = new Set()
    if (allHashes.length > 0) {
      // Query in chunks of 100 to avoid Supabase URL length limits
      for (let i = 0; i < allHashes.length; i += 100) {
        const chunk = allHashes.slice(i, i + 100)
        const { data: existing } = await supabase
          .from('ad_creatives')
          .select('meta_image_hash')
          .in('meta_image_hash', chunk)
        ;(existing || []).forEach(e => existingHashes.add(e.meta_image_hash))
      }
    }

    const newHashes = allHashes.filter(h => !existingHashes.has(h))
    let skipped = allHashes.length - newHashes.length

    // Dedup direct URLs
    let newDirectUrls = directUrlAds
    if (directUrlAds.length > 0) {
      const { data: existingByAd } = await supabase
        .from('ad_creatives')
        .select('meta_ad_id')
        .in('meta_ad_id', [...new Set(directUrlAds.map(d => d.ad_id))])
        .eq('source', 'meta')
      const existingAdIds = new Set((existingByAd || []).map(e => e.meta_ad_id))
      const beforeCount = newDirectUrls.length
      newDirectUrls = directUrlAds.filter(d => !existingAdIds.has(d.ad_id))
      skipped += beforeCount - newDirectUrls.length
    }

    if (newHashes.length === 0 && newDirectUrls.length === 0) {
      return NextResponse.json({ synced: 0, skipped, errors: 0, message: 'All creatives already synced' })
    }

    // Fetch full-size image URLs from Meta
    let imageMap = new Map()
    if (newHashes.length > 0) {
      imageMap = await fetchAdImagesByHash(newHashes, token, adAccountId)
    }

    let synced = 0
    let errors = 0
    const fallbackMonth = new Date().toISOString().slice(0, 7)

    // Sync a single image: download → R2 → DB
    const syncImage = async (imgUrl, fileName, adInfo) => {
      const venueId = campToVenue[adInfo.campaign_id]
      const venueName = venueNameMap[venueId]
      if (!venueId || !venueName) throw new Error('no venue')

      const adMonth = adInfo.created_time
        ? new Date(adInfo.created_time).toISOString().slice(0, 7)
        : fallbackMonth

      const imgRes = await fetch(imgUrl)
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`)

      const arrayBuffer = await imgRes.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg'

      const r2Key = generateR2Key(venueName, adMonth, fileName)
      const imageUrl = await uploadToR2(buffer, r2Key, contentType)

      const { error: insertErr } = await supabase.from('ad_creatives').insert({
        venue_id: venueId,
        ad_name: adInfo.ad_name,
        month: adMonth,
        image_url: imageUrl,
        file_name: fileName,
        file_size: buffer.length,
        mime_type: contentType,
        source: 'meta',
        status: 'draft',
        meta_image_hash: adInfo.hash || null,
        meta_ad_id: adInfo.ad_id,
      })

      if (insertErr) throw new Error(insertErr.message)
    }

    // Build work items
    const workItems = []

    for (const hash of newHashes) {
      const imgInfo = imageMap.get(hash)
      if (!imgInfo) { errors++; continue }
      const adInfo = hashToAds[hash]?.[0]
      if (!adInfo) { errors++; continue }
      workItems.push({ url: imgInfo.url, fileName: imgInfo.name || `${hash}.jpg`, adInfo: { ...adInfo, hash } })
    }

    for (const d of newDirectUrls) {
      workItems.push({ url: d.url, fileName: `${d.ad_id}_${d.type}.jpg`, adInfo: d })
    }

    // Process 5 images in parallel per batch
    const results = await parallelBatch(workItems, async (item) => {
      await syncImage(item.url, item.fileName, item.adInfo)
    }, 5)

    for (const r of results) {
      if (r.status === 'fulfilled') synced++
      else { console.error('Sync error:', r.reason?.message); errors++ }
    }

    return NextResponse.json({ synced, skipped, errors, total: allHashes.length + directUrlAds.length })
  } catch (error) {
    console.error('Creative sync error:', error)
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 })
  }
}
