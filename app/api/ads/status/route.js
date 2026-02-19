import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// PATCH: Toggle ad status inside meta_data.ads for a weekly report
export async function PATCH(request) {
  try {
    const { venue_id, week_start, week_end, ad_name, status } = await request.json()

    if (!venue_id || !week_start || !week_end || !ad_name || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sb = getSupabase()

    // Fetch the current report
    const { data: report, error: fetchError } = await sb
      .from('weekly_reports')
      .select('id, meta_data')
      .eq('venue_id', venue_id)
      .eq('week_start', week_start)
      .eq('week_end', week_end)
      .single()

    if (fetchError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Update the matching ad's status inside meta_data.ads
    const meta = report.meta_data || {}
    const updatedAds = (meta.ads || []).map(ad =>
      ad.name === ad_name ? { ...ad, status } : ad
    )
    const updatedMeta = { ...meta, ads: updatedAds }

    const { error: updateError } = await sb
      .from('weekly_reports')
      .update({ meta_data: updatedMeta })
      .eq('id', report.id)

    if (updateError) throw new Error(updateError.message)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Status update error:', err)
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 })
  }
}
