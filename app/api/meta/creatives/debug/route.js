import { NextResponse } from 'next/server'

const META_BASE = 'https://graph.facebook.com/v21.0'

// GET /api/meta/creatives/debug?campaign_id=xxx
// Returns raw Meta API response for debugging creative extraction
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const campaignId = searchParams.get('campaign_id')
  if (!campaignId) return NextResponse.json({ error: 'campaign_id required' }, { status: 400 })

  const token = process.env.META_ACCESS_TOKEN
  const adAccountId = process.env.META_AD_ACCOUNT_ID

  const params = new URLSearchParams({
    fields: 'id,name,campaign_id,created_time,creative{id,thumbnail_url,image_hash,image_url,object_story_spec,asset_feed_spec}',
    filtering: JSON.stringify([{ field: 'campaign.id', operator: 'EQUAL', value: campaignId }]),
    limit: '50',
    access_token: token,
  })

  const res = await fetch(`${META_BASE}/${adAccountId}/ads?${params}`)
  const json = await res.json()

  // Summarize each ad's creative structure
  const summary = (json.data || []).map(ad => {
    const spec = ad.creative?.object_story_spec || {}
    const feed = ad.creative?.asset_feed_spec || null
    return {
      ad_id: ad.id,
      ad_name: ad.name,
      created_time: ad.created_time,
      creative_id: ad.creative?.id,
      creative_thumbnail_url: ad.creative?.thumbnail_url ? 'yes' : 'no',
      creative_image_hash: ad.creative?.image_hash || null,
      creative_image_url: ad.creative?.image_url || null,
      spec_keys: Object.keys(spec),
      has_link_data: !!spec.link_data,
      has_video_data: !!spec.video_data,
      video_data_keys: spec.video_data ? Object.keys(spec.video_data) : [],
      link_data_child_count: spec.link_data?.child_attachments?.length || 0,
      has_feed_spec: !!feed,
      feed_images: feed?.images?.length || 0,
      feed_videos: feed?.videos?.length || 0,
    }
  })

  return NextResponse.json({ total_ads: json.data?.length || 0, summary })
}
