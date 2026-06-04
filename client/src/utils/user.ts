import { authUserId } from "@/composables/useAuth";

// A stable, per-browser identifier so the server can recognise a returning
// user across reconnects/refreshes (socket ids change on every connection).
// A signed-in user is identified by their account id (so they're the same
// player across devices); anonymous users fall back to a random per-browser id.
// Note: localStorage is shared across tabs of the same origin, so all tabs in
// one browser are treated as the same user.
export function getUserId(): string {
  const authed = authUserId();
  if (authed) return authed;

  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
}
