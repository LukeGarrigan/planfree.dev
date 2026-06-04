import { ref } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Module-level so every component shares one auth state (same pattern as the
// other composables).
const user = ref<User | null>(null);
const ready = ref(false);

let initialised = false;

// Awaited once at startup (before the app mounts) so getUserId() can read the
// session synchronously when wiring up the socket handshake.
export async function initAuth() {
  if (!supabase || initialised) {
    ready.value = true;
    return;
  }
  initialised = true;
  const { data } = await supabase.auth.getSession();
  user.value = data.session?.user ?? null;
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
  ready.value = true;
}

// The authenticated user's stable id, or null when signed out / auth disabled.
export function authUserId(): string | null {
  return user.value?.id ?? null;
}

export type AuthProvider = "github" | "google";

export function useAuth() {
  const authEnabled = !!supabase;

  function displayName(): string {
    const meta = user.value?.user_metadata ?? {};
    return meta.full_name || meta.name || user.value?.email || "Account";
  }

  async function signInWith(provider: AuthProvider) {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return { user, ready, authEnabled, displayName, signInWith, signOut };
}
