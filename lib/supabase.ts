import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we have valid config
const hasValidConfig = supabaseUrl && supabaseUrl !== 'https://dummy.supabase.co' && supabaseAnonKey

// Create real clients only if config is valid
export const supabase = hasValidConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export const supabaseAdmin = supabaseUrl && supabaseServiceKey && supabaseServiceKey !== 'dummy-key'
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Helper function to check if Supabase is available
export function isSupabaseAvailable() {
  return supabase !== null
}
