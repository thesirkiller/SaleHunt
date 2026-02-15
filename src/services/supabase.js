import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL ou Anon Key não configurados no arquivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Eagerly initialize the session BEFORE React mounts.
// This prevents React 18 StrictMode double-mount from consuming
// the URL hash tokens (access_token, type=recovery) on the first
// mount and then aborting, leaving the second mount without tokens.
// By calling getSession() here at module level, the supabase client
// processes the hash tokens synchronously before any component mounts.
export const sessionReady = supabase.auth.getSession()
