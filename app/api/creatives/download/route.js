import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY
  )
}

const sanitize = (s) => (s || 'creative').replace(/[\\/:*?"<>|]+/g, '_').trim()

const extFromMime = (mime, url = '') => {
  if (mime?.includes('png')) return 'png'
  if (mime?.includes('webp')) return 'webp'
  if (mime?.includes('gif')) return 'gif'
  if (mime?.includes('jpeg') || mime?.includes('jpg')) return 'jpg'
  const m = url.match(/\.(png|jpe?g|webp|gif)(?:\?|$)/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg'
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = getSupabase()
    const { data: creative, error } = await supabase
      .from('ad_creatives')
      .select('id, ad_name, month, image_url, file_name, mime_type')
      .eq('id', id)
      .single()

    if (error || !creative) {
      return NextResponse.json({ error: 'creative not found' }, { status: 404 })
    }

    const upstream = await fetch(creative.image_url)
    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream fetch failed' }, { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') || creative.mime_type || 'application/octet-stream'
    const ext = extFromMime(creative.mime_type || contentType, creative.image_url)
    const filename = creative.file_name || `${sanitize(creative.ad_name)}_${creative.month || ''}.${ext}`

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: e.message || 'download failed' }, { status: 500 })
  }
}
