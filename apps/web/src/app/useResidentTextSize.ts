import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { useRouterState } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';
import { AppRoute } from './navigation';

// The resident app reads a step bigger (see `largeTextStep`). It goes on <html>
// because dialogs render outside the app tree. Without a session, the path says
// which app this is.
export function useResidentTextSize(): void {
  const mode = useSessionStore((state) => state.session?.mode ?? null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const large = mode === null ? !pathname.startsWith(AppRoute.Admin) : mode === LoginMode.Usuario;

  useLayoutEffect(() => {
    document.documentElement.dataset.textSize = large ? 'large' : 'normal';
  }, [large]);
}
