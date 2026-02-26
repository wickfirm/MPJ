import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PATCH /api/meta/meta-data
// Body: { venue_id, week_start, week_end, level, index, field, value }
// Patches a single field on an item in weekly_reports.meta_data
// field can be 'hidden', 'audience.location', 'audience.age', etc.
export async function PATCH(req) {
  try {
    const { venue_id, week_start, week_end, level, index, field, value } = await req.json()

    if (!venue_id || !week_start || !week_end || !level || index == null || !field) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Load current meta_data
    const { data: report, error: loadErr } = await supabase
      .from('weekly_reports')
      .select('id, meta_data')
      .eq('venue_id', venue_id)
      .eq('week_start', week_start)
      .eq('week_end', week_end)
      .maybeSingle()

    if (loadErr) throw loadErr
    if (!report) return NextResponse.json({ error: 'Report not found for this venue/week' }, { status: 404 })

    const metaData = report.meta_data || {}
    const items    = [...(metaData[level] || [])]

    if (index >= items.length) {
      return NextResponse.json({ error: `Index ${index} out of range for ${level}` }, { status: 400 })
    }

    // Support nested fields like 'audience.location'
    const parts = field.split('.')
    if (parts.length === 1) {
      items[index] = { ...items[index], [field]: value }
    } else {
      // e.g. field = 'audience.interests' → items[index].audience.interests = value
      const [parent, ...rest] = parts
      const nested = { ...(items[index][parent] || {}) }
      let cur = nested
      for (let i = 0; i < rest.length - 1; i++) {
        cur[rest[i]] = { ...(cur[rest[i]] || {}) }
        cur = cur[rest[i]]
      }
      cur[rest[rest.length - 1]] = value
      items[index] = { ...items[index], [parent]: nested }
    }

    const newMetaData = { ...metaData, [level]: items }

    const { error: updateErr } = await supabase
      .from('weekly_reports')
      .update({ meta_data: newMetaData })
      .eq('id', report.id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[meta/meta-data PATCH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
