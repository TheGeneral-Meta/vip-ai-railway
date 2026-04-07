import { createClient } from '@supabase/supabase-js'

// Check if we're in build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

// Only initialize Supabase if we have the required env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Dummy client for build time
const dummyClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({ limit: async () => [] })
      }),
      single: async () => ({ data: null, error: null })
    }),
    insert: () => ({ eq: () => ({}) }),
    update: () => ({ eq: () => ({}) })
  })
} as any

export const supabase = !isBuildTime && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummyClient

export const supabaseAdmin = !isBuildTime && supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : dummyClient
