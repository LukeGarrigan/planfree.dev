// A stable, per-browser identifier so the server can recognise a returning
// user across reconnects/refreshes (socket ids change on every connection).
// Note: localStorage is shared across tabs of the same origin, so all tabs in
// one browser are treated as the same user.
export function getUserId(): string {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
}
