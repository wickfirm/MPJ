import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  )
}

// PATCH: Upsert ad active/inactive status into ad_statuses table
export async function PATCH(request) {
  try {
    const { venue_id, week_start, week_end, ad_name, status } = await request.json()

    if (!venue_id || !week_start || !week_end || !ad_name || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sb = getSupabase()

    const { error } = await sb.from('ad_statuses').upsert({
      venue_id,
      week_start,
      week_end,
      ad_name,
      is_active: status === 'active',
      updated_at: new Date().toISOString()
    }, { onConflict: 'venue_id,week_start,week_end,ad_name' })

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Status update error:', err)
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 })
  }
}
