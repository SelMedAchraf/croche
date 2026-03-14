import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Custom lock implementation to enable Back/Forward Cache (bfcache)
// The default Supabase lock uses the Web Locks API, which prevents bfcache eligibility.
// This no-op lock allows the page to be cached while still functioning correctly
// for the majority of single-tab use cases.
const bfcacheLock = {
  async acquire(name, callback) {
    return await callback();
  }
};

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase-auth-token',
    storage: window.localStorage,
    // Use the custom lock to prevent WebLocks API usage
    lock: bfcacheLock
  }
});


