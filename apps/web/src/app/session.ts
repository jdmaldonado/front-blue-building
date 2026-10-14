import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { AppRoute } from './navigation';
import { queryClient } from './queryClient';
import { router } from './router';

// Drops the session, the cached data and sends the user back to their login. Used by
// the sign out button and by the 401 handler of the HTTP client.
export function endSession(): void {
  const { session, clearSession } = useSessionStore.getState();
  if (session === null) {
    return;
  }
  clearSession();
  queryClient.clear();
  // Each session goes back to the door it came in through.
  const to = session.mode === LoginMode.Admin ? AppRoute.AdminLogin : AppRoute.Login;
  void router.navigate({ to, replace: true });
}
