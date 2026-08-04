import { LoginMode } from '@bb/core';
import { selectIsSuperUser, useSessionStore } from '@bb/logic';
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

// The staff panel. Two questions: is there a session, and is it staff. Anyone
// else goes to their own area, never to an error screen.
export function requireSuperUser(): void {
  const state = useSessionStore.getState();
  if (state.session === null) {
    throw redirect({ to: AppRoute.Login });
  }
  if (!selectIsSuperUser(state)) {
    // An admin session without SUPER_USER has no area of its own: the API
    // answers 401 to the whole panel. The profile is the only screen left.
    const to = state.session.mode === LoginMode.Admin ? AppRoute.Account : landingPathFor(state.session);
    throw redirect({ to });
  }
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
