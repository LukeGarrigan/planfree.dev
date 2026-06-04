import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// No-op when the Supabase env vars are unset (e.g. local dev without auth),
// mirroring the optional Sentry/Redis wiring elsewhere. Consumers null-check.
// PKCE returns the auth code as a `?code=` query param rather than in the URL
// hash, so it doesn't collide with the app's hash-based routing.
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          flowType: "pkce",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;
