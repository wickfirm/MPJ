// ── Meta Marketing API v21.0 client ──────────────────────────────────────────

const META_BASE = 'https://graph.facebook.com/v21.0'

/**
 * Extract the numeric value of a specific action type from a Meta actions array.
 * e.g. extractAction(actions, 'link_click') → number
 */
export function extractAction(actions = [], type) {
  const item = actions?.find(a => a.action_type === type)
  return item ? parseFloat(item.value) || 0 : 0
}

/**
 * Parse Meta targeting object into the audience shape used by AdSetRow.
 */
export function parseTargeting(targeting = {}) {
  if (!targeting || Object.keys(targeting).length === 0) return null

  const geo = targeting.geo_locations || {}
  const locationParts = []
  if (geo.custom_locations?.length) {
    locationParts.push(geo.custom_locations.map(cl => {
      const name = cl.name || cl.address_string || `${cl.latitude?.toFixed(2)},${cl.longitude?.toFixed(2)}`
      const radius = cl.radius ? ` (+${cl.radius}${cl.distance_unit === 'mile' ? 'mi' : 'km'})` : ''
      return `${name}${radius}`
    }).join(', '))
  }
  if (geo.places?.length) {
    locationParts.push(geo.places.map(p => {
      const name = p.name || p.key
      const radius = p.radius ? ` (+${p.radius}${p.distance_unit === 'mile' ? 'mi' : 'km'})` : ''
      return `${name}${radius}`
    }).join(', '))
  }
  if (geo.cities?.length)    locationParts.push(geo.cities.map(c => c.name).join(', '))
  if (geo.regions?.length)   locationParts.push(geo.regions.map(r => r.name).join(', '))
  if (geo.countries?.length) locationParts.push(geo.countries.join(', '))
  const location = locationParts.join(' · ') || 'Not specified'

  const age    = targeting.age_min || targeting.age_max
    ? `${targeting.age_min || '18'}–${targeting.age_max || '65+'}`
    : 'All ages'
  const gMap   = { 1: 'Male', 2: 'Female' }
  const gender = targeting.genders?.length
    ? targeting.genders.map(g => gMap[g] || g).join(' & ')
    : 'All'

  const hasCustom    = targeting.custom_audiences?.length > 0
  const hasInterests = targeting.interests?.length > 0 ||
    targeting.flexible_spec?.some(f => f.interests?.length > 0)
  const type = hasCustom ? 'Custom' : hasInterests ? 'Interest-based' : 'Broad'

  const interests = [
    ...(targeting.interests || []),
    ...(targeting.flexible_spec?.flatMap(f => f.interests || []) || []),
  ].map(i => i.name).filter(Boolean)

  const behaviors = [
    ...(targeting.behaviors || []),
    ...(targeting.flexible_spec?.flatMap(f => f.behaviors || []) || []),
  ].map(b => b.name).filter(Boolean)

  const customAudiences = (targeting.custom_audiences || []).map(a => a.name).filter(Boolean)

  const excluded = targeting.exclusions
    ? [...(targeting.exclusions.custom_audiences || []).map(a => a.name)].filter(Boolean)
    : []

  return { type, location, age, gender, interests, behaviors, customAudiences, excluded, demographics: [] }
}

/**
 * Fetch object fields (e.g. effective_status) from a Meta collection endpoint.
 * endpoint: 'campaigns' | 'adsets' | 'ads'
 * Returns a Map of id → { status, audience? }
 */
export async function fetchMetaObjectStatuses(endpoint, token, adAccountId) {
  const fields = endpoint === 'adsets' ? 'id,effective_status,targeting' : 'id,effective_status'
  const params = new URLSearchParams({
    fields,
    limit:        '200',
    access_token: token,
  })

  let url = `${META_BASE}/${adAccountId}/${endpoint}?${params}`
  const statusMap = new Map()

  for (let page = 0; page < 3; page++) {
    const res  = await fetch(url)
    const json = await res.json()

    if (json.error) {
      // Non-fatal — statuses are best-effort
      console.warn(`[meta-api] fetchMetaObjectStatuses(${endpoint}) error:`, json.error.message)
      break
    }

    ;(json.data || []).forEach(obj => {
      const entry = { status: obj.effective_status || 'UNKNOWN' }
      if (obj.targeting) entry.audience = parseTargeting(obj.targeting)
      statusMap.set(obj.id, entry)
    })

    if (!json.paging?.next) break
    url = json.paging.next
  }

  return statusMap
}

/**
 * Fetch insights from Meta API for a given level (campaign | adset | ad).
 * Handles basic pagination (up to 3 pages / 600 rows — more than enough for 1 account).
 */
export async function fetchMetaInsights(level, fields, timeRange, token, adAccountId) {
  const params = new URLSearchParams({
    level,
    fields,
    time_range: JSON.stringify(timeRange),
    limit: '200',
    access_token: token,
  })

  let url = `${META_BASE}/${adAccountId}/insights?${params}`
  const rows = []

  for (let page = 0; page < 3; page++) {
    const res = await fetch(url)
    const json = await res.json()

    if (json.error) {
      const msg = json.error.message || 'Meta API error'
      const err = new Error(msg)
      err.metaCode = json.error.code
      throw err
    }

    if (json.data) rows.push(...json.data)
    if (!json.paging?.next) break
    url = json.paging.next
  }

  return rows
}

/**
 * Normalize a raw campaign row from Meta into our internal shape.
 */
export function normalizeCampaign(row) {
  return {
    campaign_id:  row.campaign_id,
    name:         row.campaign_name,
    impressions:  parseInt(row.impressions) || 0,
    clicks:       parseInt(row.clicks) || 0,
    linkClicks:   extractAction(row.actions, 'link_click'),
    engagement:   extractAction(row.actions, 'post_engagement'),
    spend:        parseFloat(row.spend) || 0,
    reach:        parseInt(row.reach) || 0,
    ctr:          parseFloat(row.ctr) || 0,
    status:       row.effective_status || 'UNKNOWN',
  }
}

/**
 * Normalize a raw ad set row.
 */
export function normalizeAdSet(row) {
  return {
    adset_id:     row.adset_id,
    campaign_id:  row.campaign_id,
    name:         row.adset_name,
    impressions:  parseInt(row.impressions) || 0,
    clicks:       parseInt(row.clicks) || 0,
    linkClicks:   extractAction(row.actions, 'link_click'),
    engagement:   extractAction(row.actions, 'post_engagement'),
    spend:        parseFloat(row.spend) || 0,
    reach:        parseInt(row.reach) || 0,
    ctr:          parseFloat(row.ctr) || 0,
    status:       row.effective_status || 'UNKNOWN',
  }
}

/**
 * Normalize a raw ad row.
 */
export function normalizeAd(row) {
  return {
    ad_id:        row.ad_id,
    adset_id:     row.adset_id,
    campaign_id:  row.campaign_id,
    name:         row.ad_name,
    impressions:  parseInt(row.impressions) || 0,
    clicks:       parseInt(row.clicks) || 0,
    linkClicks:   extractAction(row.actions, 'link_click'),
    engagement:   extractAction(row.actions, 'post_engagement'),
    spend:        parseFloat(row.spend) || 0,
    reach:        parseInt(row.reach) || 0,
    ctr:          parseFloat(row.ctr) || 0,
    status:       row.effective_status || 'UNKNOWN',
  }
}

/**
 * Group normalized campaigns/adSets/ads by venue_id using the mapping table rows.
 * Returns { [venue_id]: {campaigns, adSets, ads}, __unmapped__: {campaigns, adSets, ads} }
 */
export function mapToVenues(campaigns, adSets, ads, mappingRows) {
  // Build lookup: campaign_id → venue_id
  const campToVenue = {}
  mappingRows.forEach(m => {
    if (m.venue_id) campToVenue[m.campaign_id] = m.venue_id
  })

  const byVenue = {}
  const unmapped = { campaigns: [], adSets: [], ads: [] }

  campaigns.forEach(c => {
    const vid = campToVenue[c.campaign_id]
    if (vid) {
      if (!byVenue[vid]) byVenue[vid] = { campaigns: [], adSets: [], ads: [] }
      byVenue[vid].campaigns.push(c)
    } else {
      unmapped.campaigns.push(c)
    }
  })

  adSets.forEach(as => {
    const vid = campToVenue[as.campaign_id]
    if (vid) {
      if (!byVenue[vid]) byVenue[vid] = { campaigns: [], adSets: [], ads: [] }
      byVenue[vid].adSets.push(as)
    } else {
      unmapped.adSets.push(as)
    }
  })

  ads.forEach(a => {
    const vid = campToVenue[a.campaign_id]
    if (vid) {
      if (!byVenue[vid]) byVenue[vid] = { campaigns: [], adSets: [], ads: [] }
      byVenue[vid].ads.push(a)
    } else {
      unmapped.ads.push(a)
    }
  })

  return { ...byVenue, __unmapped__: unmapped }
}

/**
 * Rate-limit helper: wait between API calls to avoid bans.
 */
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

/**
 * Parse ad creative data into hashes and direct URLs.
 */
function extractCreativeImages(ad, campaignId) {
  const hashes = []
  const directUrls = []
  const spec = ad.creative?.object_story_spec
  const feedSpec = ad.creative?.asset_feed_spec

  // ── object_story_spec extraction ──
  if (spec?.link_data) {
    if (spec.link_data.image_hash) {
      hashes.push({ hash: spec.link_data.image_hash, type: 'image' })
    }
    if (spec.link_data.child_attachments) {
      for (const card of spec.link_data.child_attachments) {
        if (card.image_hash) {
          hashes.push({ hash: card.image_hash, type: 'carousel' })
        } else if (card.picture || card.image_url) {
          directUrls.push({ url: card.picture || card.image_url, type: 'carousel' })
        }
      }
    }
  }

  // Video thumbnail
  if (spec?.video_data?.image_hash) {
    hashes.push({ hash: spec.video_data.image_hash, type: 'video_thumb' })
  } else if (spec?.video_data?.image_url) {
    directUrls.push({ url: spec.video_data.image_url, type: 'video_thumb' })
  } else if (spec?.video_data?.video_id) {
    // Video exists but no image hash/url — use creative thumbnail_url as fallback
    const thumbUrl = ad.creative?.thumbnail_url
    if (thumbUrl) {
      directUrls.push({ url: thumbUrl, type: 'video_thumb' })
    } else {
      // Store video_id so sync route can fetch thumbnail from Video API
      directUrls.push({ video_id: spec.video_data.video_id, type: 'video_needs_thumb' })
    }
  }

  // ── asset_feed_spec extraction (dynamic creative) ──
  if (feedSpec) {
    for (const img of (feedSpec.images || [])) {
      if (img.hash) hashes.push({ hash: img.hash, type: 'dynamic' })
      else if (img.url) directUrls.push({ url: img.url, type: 'dynamic' })
    }
    for (const vid of (feedSpec.videos || [])) {
      if (vid.thumbnail_hash) hashes.push({ hash: vid.thumbnail_hash, type: 'dynamic_video' })
      else if (vid.thumbnail_url) directUrls.push({ url: vid.thumbnail_url, type: 'dynamic_video' })
    }
  }

  // Top-level creative image_hash (covers cases where spec extraction misses it)
  if (hashes.length === 0 && ad.creative?.image_hash) {
    hashes.push({ hash: ad.creative.image_hash, type: 'creative_direct' })
  }

  if (hashes.length === 0 && directUrls.length === 0) {
    // Log unhandled creative structures for debugging
    const specKeys = spec ? Object.keys(spec) : []
    const feedKeys = feedSpec ? Object.keys(feedSpec) : []
    const videoKeys = spec?.video_data ? Object.keys(spec.video_data) : []
    console.warn(`[meta-api] No images extracted for ad ${ad.id} "${ad.name}" | spec keys: [${specKeys}] | video_data keys: [${videoKeys}] | feedSpec keys: [${feedKeys}] | creative.image_hash: ${ad.creative?.image_hash || 'none'} | creative.image_url: ${ad.creative?.image_url || 'none'} | thumbnail_url: ${ad.creative?.thumbnail_url || 'none'}`)
    // Last resort: use the creative thumbnail_url if available
    if (ad.creative?.thumbnail_url) {
      directUrls.push({ url: ad.creative.thumbnail_url, type: 'creative_thumb' })
    } else if (ad.creative?.image_url) {
      directUrls.push({ url: ad.creative.image_url, type: 'creative_image' })
    } else {
      return null
    }
  }

  return {
    ad_id: ad.id,
    ad_name: ad.name,
    campaign_id: ad.campaign_id || campaignId,
    created_time: ad.created_time || null,
    image_hashes: hashes,
    image_urls: directUrls,
  }
}

/**
 * Fetch all ads for a single campaign (with pagination).
 */
async function fetchAdsForCampaign(campaignId, token, adAccountId, { dateFrom, dateTo } = {}) {
  const results = []
  const filtering = [{ field: 'campaign.id', operator: 'EQUAL', value: campaignId }]

  const params = new URLSearchParams({
    fields: 'id,name,campaign_id,created_time,creative{id,thumbnail_url,image_hash,image_url,object_story_spec,asset_feed_spec}',
    filtering: JSON.stringify(filtering),
    limit: '200',
    access_token: token,
  })

  let url = `${META_BASE}/${adAccountId}/ads?${params}`

  for (let page = 0; page < 3; page++) {
    const res = await fetch(url)
    if (res.status === 429) {
      console.warn(`[meta-api] Rate limited on campaign ${campaignId}, waiting 30s...`)
      await sleep(30000)
      const retry = await fetch(url)
      const json = await retry.json()
      if (json.error) break
      for (const ad of (json.data || [])) {
        const parsed = extractCreativeImages(ad, campaignId)
        if (parsed) {
          // Client-side date filter (more reliable than Meta's filtering)
          if (dateFrom && parsed.created_time && parsed.created_time < dateFrom) continue
          if (dateTo && parsed.created_time && parsed.created_time > dateTo + 'T23:59:59') continue
          results.push(parsed)
        }
      }
      if (!json.paging?.next) break
      url = json.paging.next
      continue
    }

    const json = await res.json()
    if (json.error) { console.warn(`[meta-api] fetchAdsForCampaign(${campaignId}) error:`, json.error.message); break }

    console.log(`[meta-api] Campaign ${campaignId}: ${json.data?.length || 0} ads returned`)
    for (const ad of (json.data || [])) {
      const hasSpec = !!ad.creative?.object_story_spec
      const hasFeed = !!ad.creative?.asset_feed_spec
      const specType = hasSpec ? Object.keys(ad.creative.object_story_spec).join(',') : 'none'
      console.log(`[meta-api] Ad ${ad.id} "${ad.name}" | spec: [${specType}] | feedSpec: ${hasFeed} | creative.image_hash: ${ad.creative?.image_hash || '-'} | creative.thumbnail_url: ${ad.creative?.thumbnail_url ? 'yes' : 'no'}`)

      const parsed = extractCreativeImages(ad, campaignId)
      if (parsed) {
        if (parsed.created_time) {
          const adDate = new Date(parsed.created_time)
          if (dateFrom && adDate < new Date(dateFrom)) continue
          if (dateTo && adDate > new Date(dateTo + 'T23:59:59')) continue
        }
        console.log(`[meta-api]   → extracted ${parsed.image_hashes.length} hashes, ${parsed.image_urls.length} urls`)
        results.push(parsed)
      } else {
        console.log(`[meta-api]   → SKIPPED (no images extracted)`)
      }
    }

    if (!json.paging?.next) break
    url = json.paging.next
  }

  return results
}

/**
 * Fetch ads with their creative image hashes for given campaign IDs.
 * Fetches up to 5 campaigns in parallel for speed.
 */
export async function fetchAdCreatives(campaignIds, token, adAccountId, { dateFrom, dateTo } = {}) {
  const results = []
  const batchSize = 5 // Parallel campaigns

  for (let i = 0; i < campaignIds.length; i += batchSize) {
    const batch = campaignIds.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(cid => fetchAdsForCampaign(cid, token, adAccountId, { dateFrom, dateTo }))
    )
    for (const r of batchResults) results.push(...r)
  }

  return results
}

/**
 * Batch-fetch full-size image URLs from Meta ad account by image hashes.
 * Returns Map of hash → { url, name }
 */
export async function fetchAdImagesByHash(hashes, token, adAccountId) {
  const imageMap = new Map()
  // Meta allows up to 50 hashes per request
  const batchSize = 50

  for (let i = 0; i < hashes.length; i += batchSize) {
    const batch = hashes.slice(i, i + batchSize)
    const params = new URLSearchParams({
      hashes: JSON.stringify(batch),
      fields: 'hash,url,name',
      access_token: token,
    })

    const res = await fetch(`${META_BASE}/${adAccountId}/adimages?${params}`)
    if (res.status === 429) {
      console.warn(`[meta-api] Rate limited on adimages, waiting 30s...`)
      await sleep(30000)
    }
    const json = await res.json()
    if (json.error) { console.warn(`[meta-api] fetchAdImagesByHash error:`, json.error.message); continue }

    // Meta returns adimages as { data: { "hash1": { hash, url, ... }, "hash2": ... } }
    // NOT as an array — iterate over object values
    const images = json.data || {}
    const imgList = Array.isArray(images) ? images : Object.values(images)
    for (const img of imgList) {
      if (img.hash) {
        imageMap.set(img.hash, { url: img.url, name: img.name || `${img.hash}.jpg` })
      }
    }
  }

  return imageMap
}
