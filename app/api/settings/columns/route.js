import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const SETTING_KEY = 'meta_column_visibility'

// GET /api/settings/columns — return column visibility settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('report_settings')
      .select('setting_value')
      .eq('setting_key', SETTING_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // Default if not found
    const defaults = { spend: false, impressions: true, ctr: true, linkClicks: true, engagement: true, reach: false }
    return NextResponse.json({ columns: data?.setting_value || defaults })
  } catch (err) {
    console.error('[settings/columns GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/settings/columns — upsert { columns: {...} }
export async function POST(req) {
  try {
    const body = await req.json()
    const { columns } = body

    if (!columns || typeof columns !== 'object') {
      return NextResponse.json({ error: 'columns object required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('report_settings')
      .upsert({
        setting_key:   SETTING_KEY,
        setting_value: columns,
        updated_at:    new Date().toISOString(),
      }, { onConflict: 'setting_key' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[settings/columns POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
