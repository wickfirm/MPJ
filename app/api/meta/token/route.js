import { NextResponse } from 'next/server'

// POST /api/meta/token — exchange short-lived token for long-lived (60 days)
// Body: { short_lived_token? }  — if omitted, uses META_ACCESS_TOKEN env var
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const shortToken = body.short_lived_token || process.env.META_ACCESS_TOKEN

    if (!shortToken) {
      return NextResponse.json({ error: 'No token provided and META_ACCESS_TOKEN not set' }, { status: 400 })
    }

    const appId     = process.env.META_APP_ID
    const appSecret = process.env.META_APP_SECRET

    if (!appId || !appSecret) {
      return NextResponse.json({ error: 'META_APP_ID or META_APP_SECRET not configured' }, { status: 500 })
    }

    const params = new URLSearchParams({
      grant_type:        'fb_exchange_token',
      client_id:         appId,
      client_secret:     appSecret,
      fb_exchange_token: shortToken,
    })

    const res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?${params}`)
    const json = await res.json()

    if (json.error) {
      return NextResponse.json({ error: json.error.message }, { status: 400 })
    }

    return NextResponse.json({
      long_lived_token: json.access_token,
      expires_in:       json.expires_in,
      token_type:       json.token_type,
    })
  } catch (err) {
    console.error('[meta/token POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
