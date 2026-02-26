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
