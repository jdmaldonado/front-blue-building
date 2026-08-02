import type { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { redirect } from '@tanstack/react-router';
import { AppRoute, landingPathFor } from './navigation';

// Guards live outside the route files so every route reuses the same rule.
// `beforeLoad` is not a component, hence `getState()` instead of the hook.
// A session in the wrong area is not an error: it gets sent to its own landing.
export function requireMode(mode: LoginMode) {
  return () => {
    const { session } = useSessionStore.getState();
    if (session === null) {
      throw redirect({ to: AppRoute.Login });
    }
    if (session.mode !== mode) {
      throw redirect({ to: landingPathFor(session) });
    }
  };
}

// Public auth screens (login, recovery): with a session there is nothing to do
// here, so the user goes to their own area.
export function redirectIfAuthenticated(): void {
  const { session } = useSessionStore.getState();
  if (session !== null) {
    throw redirect({ to: landingPathFor(session) });
  }
}
