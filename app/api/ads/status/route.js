import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// PATCH: Toggle ad status inside meta_data.ads via SECURITY DEFINER RPC
export async function PATCH(request) {
  try {
    const { venue_id, week_start, week_end, ad_name, status } = await request.json()

    if (!venue_id || !week_start || !week_end || !ad_name || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sb = getSupabase()

    const { data, error } = await sb.rpc('update_ad_status', {
      p_venue_id:   venue_id,
      p_week_start: week_start,
      p_week_end:   week_end,
      p_ad_name:    ad_name,
      p_status:     status,
    })

    if (error) throw new Error(error.message)
    if (!data) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Status update error:', err)
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 })
  }
}
