import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/meta/mappings — return all campaign mappings with venue name
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('meta_campaign_mappings')
      .select('*, venues(id, name)')
      .order('campaign_name')

    if (error) throw error
    return NextResponse.json({ mappings: data || [] })
  } catch (err) {
    console.error('[meta/mappings GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/meta/mappings — bulk upsert { mappings: [{campaign_id, campaign_name, venue_id}] }
export async function POST(req) {
  try {
    const body = await req.json()
    const { mappings } = body

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return NextResponse.json({ error: 'mappings array required' }, { status: 400 })
    }

    const rows = mappings.map(m => ({
      campaign_id:   m.campaign_id,
      campaign_name: m.campaign_name,
      venue_id:      m.venue_id || null,
      updated_at:    new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('meta_campaign_mappings')
      .upsert(rows, { onConflict: 'campaign_id' })

    if (error) throw error
    return NextResponse.json({ success: true, saved: rows.length })
  } catch (err) {
    console.error('[meta/mappings POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
