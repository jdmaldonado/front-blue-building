import type { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { redirect } from '@tanstack/react-router';
import { AppRoute, landingPathFor } from './navigation';

// `beforeLoad` is not a component, so we use `getState()` and not the hook.
// A session in the wrong area is not an error: we send it to its own landing.
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

// For screens that any signed in user can open, whatever their mode.
export function requireSession(): void {
  const { session } = useSessionStore.getState();
  if (session === null) {
    throw redirect({ to: AppRoute.Login });
  }
}

// With a session there is nothing to do on login or recovery screens.
export function redirectIfAuthenticated(): void {
  const { session } = useSessionStore.getState();
  if (session !== null) {
    throw redirect({ to: landingPathFor(session) });
  }
}
