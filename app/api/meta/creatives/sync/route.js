import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAdCreatives, fetchAdImagesByHash } from '@/lib/meta-api'
import { uploadToR2, generateR2Key } from '@/lib/r2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY
  )
}

// POST /api/meta/creatives/sync
// Body: { venue_id: string | 'all' }
export async function POST(req) {
  try {
    const { venue_id } = await req.json()
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

    // Fetch ads with creative hashes from Meta
    const adCreatives = await fetchAdCreatives(campaignIds, token, adAccountId)

    // Collect all unique hashes
    const allHashes = []
    const hashToAds = {} // hash → [{ ad_id, ad_name, campaign_id, type }]
    for (const ad of adCreatives) {
      for (const h of ad.image_hashes) {
        if (!hashToAds[h.hash]) {
          hashToAds[h.hash] = []
          allHashes.push(h.hash)
        }
        hashToAds[h.hash].push({ ad_id: ad.ad_id, ad_name: ad.ad_name, campaign_id: ad.campaign_id, type: h.type })
      }
    }

    if (allHashes.length === 0) {
      return NextResponse.json({ synced: 0, skipped: 0, errors: 0, message: 'No creatives found in Meta ads' })
    }

    // Dedup: check which hashes already exist in ad_creatives
    const { data: existing } = await supabase
      .from('ad_creatives')
      .select('meta_image_hash')
      .in('meta_image_hash', allHashes)
    const existingHashes = new Set((existing || []).map(e => e.meta_image_hash))

    const newHashes = allHashes.filter(h => !existingHashes.has(h))
    const skipped = allHashes.length - newHashes.length

    if (newHashes.length === 0) {
      return NextResponse.json({ synced: 0, skipped, errors: 0, message: 'All creatives already synced' })
    }

    // Fetch full-size image URLs from Meta
    const imageMap = await fetchAdImagesByHash(newHashes, token, adAccountId)

    // Download, upload to R2, insert into DB
    let synced = 0
    let errors = 0
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

    for (const hash of newHashes) {
      const imgInfo = imageMap.get(hash)
      if (!imgInfo) { errors++; continue }

      // Get venue info from the first ad that uses this hash
      const adInfo = hashToAds[hash]?.[0]
      if (!adInfo) { errors++; continue }

      const venueId = campToVenue[adInfo.campaign_id]
      const venueName = venueNameMap[venueId]
      if (!venueId || !venueName) { errors++; continue }

      try {
        // Download image from Meta CDN
        const imgRes = await fetch(imgInfo.url)
        if (!imgRes.ok) { errors++; continue }

        const arrayBuffer = await imgRes.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
        const fileName = imgInfo.name || `${hash}.jpg`

        // Upload to R2
        const r2Key = generateR2Key(venueName, currentMonth, fileName)
        const imageUrl = await uploadToR2(buffer, r2Key, contentType)

        // Insert into ad_creatives
        const { error: insertErr } = await supabase.from('ad_creatives').insert({
          venue_id: venueId,
          ad_name: adInfo.ad_name,
          month: currentMonth,
          image_url: imageUrl,
          file_name: fileName,
          file_size: buffer.length,
          mime_type: contentType,
          source: 'meta',
          status: 'draft',
          meta_image_hash: hash,
          meta_ad_id: adInfo.ad_id,
        })

        if (insertErr) { console.error('DB insert error:', insertErr.message); errors++; continue }
        synced++
      } catch (err) {
        console.error(`Error syncing hash ${hash}:`, err.message)
        errors++
      }
    }

    return NextResponse.json({ synced, skipped, errors, total: allHashes.length })
  } catch (error) {
    console.error('Creative sync error:', error)
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 })
  }
}
