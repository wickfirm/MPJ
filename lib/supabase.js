import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

const noCache = {
  global: {
    fetch: (url, options = {}) =>
      fetch(url, { ...options, cache: 'no-store' }),
  },
}

// Browser / client-side client (anon key, subject to RLS)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', noCache)

// Server-side admin client (service role key, bypasses RLS)
// Use this in all API routes that write to the database.
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || supabaseAnonKey || '',
  noCache
)
