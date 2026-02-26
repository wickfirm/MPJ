import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

// GET /api/meta/draft?week_start=&week_end= — load draft for a week
// Omit params to get the most recent draft
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const week_start = searchParams.get('week_start')
    const week_end   = searchParams.get('week_end')

    let query = supabase
      .from('meta_sync_drafts')
      .select('*')
      .order('synced_at', { ascending: false })
      .limit(1)

    if (week_start && week_end) {
      query = query.eq('week_start', week_start).eq('week_end', week_end)
    }

    const { data, error } = await query.maybeSingle()
    if (error) throw error

    return NextResponse.json({ draft: data || null })
  } catch (err) {
    console.error('[meta/draft GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/meta/draft — save a single field override
// Body: { draft_id, venue_id, level ('campaigns'|'adSets'|'ads'), index, field, value }
export async function PUT(req) {
  try {
    const body = await req.json()
    const { draft_id, venue_id, level, index, field, value } = body

    if (!draft_id || !venue_id || !level || index === undefined || !field) {
      return NextResponse.json({ error: 'draft_id, venue_id, level, index, field required' }, { status: 400 })
    }

    // Load current overrides
    const { data: draft, error: loadErr } = await supabase
      .from('meta_sync_drafts')
      .select('overrides')
      .eq('id', draft_id)
      .single()

    if (loadErr) throw loadErr

    // Deep-merge: overrides[venue_id][level][index][field] = value
    const overrides = draft.overrides || {}
    if (!overrides[venue_id]) overrides[venue_id] = {}
    if (!overrides[venue_id][level]) overrides[venue_id][level] = {}
    if (!overrides[venue_id][level][index]) overrides[venue_id][level][index] = {}
    overrides[venue_id][level][index][field] = value

    const { error: saveErr } = await supabase
      .from('meta_sync_drafts')
      .update({ overrides })
      .eq('id', draft_id)

    if (saveErr) throw saveErr

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[meta/draft PUT]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
