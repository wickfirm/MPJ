import { NextResponse } from 'next/server'

// GET /api/cron/meta-sync — called by Vercel cron every Monday 06:00 UTC
// Protected by CRON_SECRET env var
export async function GET(req) {
  try {
    // Verify secret
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate previous week (Mon–Sun)
    // Today is Monday, so previous week = last Mon → last Sun
    const now = new Date()
    const dayOfWeek = now.getUTCDay() // 0=Sun, 1=Mon
    const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // how many days back to reach Mon
    const lastMonday = new Date(now)
    lastMonday.setUTCDate(now.getUTCDate() - daysToLastMonday - 7)
    lastMonday.setUTCHours(0, 0, 0, 0)

    const lastSunday = new Date(lastMonday)
    lastSunday.setUTCDate(lastMonday.getUTCDate() + 6)

    const fmt = (d) => d.toISOString().split('T')[0]
    const week_start = fmt(lastMonday)
    const week_end   = fmt(lastSunday)

    // Call the sync endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.get('host')}`
    const syncRes = await fetch(`${baseUrl}/api/meta/sync`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ week_start, week_end }),
    })

    const syncData = await syncRes.json()

    if (!syncRes.ok) {
      return NextResponse.json({ error: syncData.error || 'Sync failed', week_start, week_end }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      week_start,
      week_end,
      ...syncData,
    })
  } catch (err) {
    console.error('[cron/meta-sync GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
