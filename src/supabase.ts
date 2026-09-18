import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env',
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

export const BUCKET_NAME = 'ganesh-mandal-photos-2026'
export const ADMIN_WHATSAPP = '917774855501'
export const MAX_PHOTOS = 3
export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const