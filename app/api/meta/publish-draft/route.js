import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/meta/publish-draft
 * Body: { venue_id, week_start, week_end }
 *
 * Promotes meta_data_draft → meta_data (client-visible).
 * Clears meta_data_draft after promotion so admin returns to "live" view.
 */
export async function POST(req) {
  try {
    const { venue_id, week_start, week_end } = await req.json()

    if (!venue_id || !week_start || !week_end) {
      return NextResponse.json({ error: 'venue_id, week_start and week_end are required' }, { status: 400 })
    }

    // Load current report
    const { data: report, error: loadErr } = await supabase
      .from('weekly_reports')
      .select('id, meta_data_draft')
      .eq('venue_id', venue_id)
      .eq('week_start', week_start)
      .eq('week_end', week_end)
      .maybeSingle()

    if (loadErr) throw loadErr
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    if (!report.meta_data_draft) {
      return NextResponse.json({ error: 'No draft to publish' }, { status: 400 })
    }

    // Promote draft → published, clear draft
    const { error: updateErr } = await supabase
      .from('weekly_reports')
      .update({
        meta_data:       report.meta_data_draft,
        meta_data_draft: null,
      })
      .eq('id', report.id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[meta/publish-draft POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
