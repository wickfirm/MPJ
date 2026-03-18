import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY
  )
}

// POST /api/meta/creatives/publish
// Body: { venue_id?: string, creative_ids?: string[] }
export async function POST(req) {
  try {
    const { venue_id, creative_ids } = await req.json()
    const supabase = getSupabase()

    let query = supabase
      .from('ad_creatives')
      .update({ status: 'published' })
      .eq('status', 'draft')

    if (creative_ids?.length) {
      query = query.in('id', creative_ids)
    } else if (venue_id) {
      query = query.eq('venue_id', venue_id)
    } else {
      return NextResponse.json({ error: 'Provide venue_id or creative_ids' }, { status: 400 })
    }

    const { data, error, count } = await query.select('id')
    if (error) throw new Error(error.message)

    return NextResponse.json({ published: data?.length || 0 })
  } catch (error) {
    console.error('Creative publish error:', error)
    return NextResponse.json({ error: error.message || 'Publish failed' }, { status: 500 })
  }
}
