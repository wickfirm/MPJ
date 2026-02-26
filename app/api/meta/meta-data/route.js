import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * PATCH /api/meta/meta-data
 * Body: { venue_id, week_start, week_end, level, item_name, field, value }
 *
 * Patches a single field on a named item inside meta_data_draft.
 * If meta_data_draft doesn't exist yet, it is initialised from meta_data first
 * (copy-on-write: the first admin edit creates the draft).
 *
 * field supports dot-notation: 'audience.interests', 'audience.location', etc.
 */
export async function PATCH(req) {
  try {
    const { venue_id, week_start, week_end, level, item_name, field, value } = await req.json()

    if (!venue_id || !week_start || !week_end || !level || !item_name || !field) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Load current meta_data + meta_data_draft
    const { data: report, error: loadErr } = await supabase
      .from('weekly_reports')
      .select('id, meta_data, meta_data_draft')
      .eq('venue_id', venue_id)
      .eq('week_start', week_start)
      .eq('week_end', week_end)
      .maybeSingle()

    if (loadErr) throw loadErr
    if (!report) return NextResponse.json({ error: 'Report not found for this venue/week' }, { status: 404 })

    // Use existing draft, or copy from published (copy-on-write)
    const source = report.meta_data_draft || report.meta_data || {}
    const items  = [...(source[level] || [])]

    // Find item by name (stable identifier after IDs are stripped)
    const idx = items.findIndex(it => it.name === item_name)
    if (idx === -1) {
      return NextResponse.json({ error: `Item "${item_name}" not found in ${level}` }, { status: 404 })
    }

    // Apply field update (supports dot-notation for nested objects)
    const parts = field.split('.')
    if (parts.length === 1) {
      items[idx] = { ...items[idx], [field]: value }
    } else {
      const [parent, ...rest] = parts
      const nested = { ...(items[idx][parent] || {}) }
      let cur = nested
      for (let i = 0; i < rest.length - 1; i++) {
        cur[rest[i]] = { ...(cur[rest[i]] || {}) }
        cur = cur[rest[i]]
      }
      cur[rest[rest.length - 1]] = value
      items[idx] = { ...items[idx], [parent]: nested }
    }

    const newDraft = { ...source, [level]: items }

    const { error: updateErr } = await supabase
      .from('weekly_reports')
      .update({ meta_data_draft: newDraft })
      .eq('id', report.id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[meta/meta-data PATCH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
