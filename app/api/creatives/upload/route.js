import { NextResponse } from 'next/server'
import { uploadToR2, deleteFromR2, generateR2Key, R2_PUBLIC_URL } from '@/lib/r2'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Lazy-initialize Supabase client (avoids build-time error when env vars aren't available)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY
  )
}

// ── POST: Upload a creative image ────────────────
export async function POST(request) {
  try {
    const formData = await request.formData()

    const file = formData.get('file')
    const venueId = formData.get('venue_id')
    const venueName = formData.get('venue_name')
    const adName = formData.get('ad_name')
    const month = formData.get('month')
    const notes = formData.get('notes') || null

    // Validate required fields
    if (!file || !venueId || !venueName || !adName || !month) {
      return NextResponse.json(
        { error: 'Missing required fields: file, venue_id, venue_name, ad_name, month' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate R2 key and upload
    const key = generateR2Key(venueName, month, file.name)
    const imageUrl = await uploadToR2(buffer, key, file.type)

    // Save record in Supabase
    const { data: creative, error: dbError } = await getSupabase()
      .from('ad_creatives')
      .insert({
        venue_id: venueId,
        ad_name: adName,
        month: month,
        image_url: imageUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        notes: notes,
      })
      .select()
      .single()

    if (dbError) {
      // If DB insert fails, try to clean up R2
      try { await deleteFromR2(key) } catch (_) {}
      throw new Error(`Database error: ${dbError.message}`)
    }

    return NextResponse.json({ success: true, creative })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

// ── DELETE: Remove a creative image ──────────────
export async function DELETE(request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing creative id' }, { status: 400 })
    }

    // Fetch the record to get the R2 key
    const { data: creative, error: fetchError } = await getSupabase()
      .from('ad_creatives')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !creative) {
      return NextResponse.json({ error: 'Creative not found' }, { status: 404 })
    }

    // Extract R2 key from the full URL
    const key = creative.image_url.replace(`${R2_PUBLIC_URL}/`, '')

    // Delete from R2
    try {
      await deleteFromR2(key)
    } catch (r2Error) {
      console.error('R2 delete warning:', r2Error.message)
      // Continue with DB deletion even if R2 fails
    }

    // Delete from Supabase
    const { error: deleteError } = await getSupabase()
      .from('ad_creatives')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Database delete error: ${deleteError.message}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
