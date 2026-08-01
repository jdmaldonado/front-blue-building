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
