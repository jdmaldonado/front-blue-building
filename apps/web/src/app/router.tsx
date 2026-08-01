import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { AdminHomePage } from '../features/admin';
import { LoginPage } from '../features/auth';
import { HomePage } from '../features/home/HomePage';
import { AppRoute, landingPathFor } from './navigation';

const rootRoute = createRootRoute({ component: Outlet });

// Guards read the session store directly: `beforeLoad` is not a component, so it
// uses `getState()`. A wrong role does not get an error screen, it gets sent to
// the area that does belong to it.
function requireMode(mode: LoginMode) {
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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoute.Login,
  beforeLoad: () => {
    const { session } = useSessionStore.getState();
    if (session !== null) {
      throw redirect({ to: landingPathFor(session) });
    }
  },
  component: LoginPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoute.Home,
  beforeLoad: requireMode(LoginMode.Usuario),
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoute.Admin,
  beforeLoad: requireMode(LoginMode.Admin),
  component: AdminHomePage,
});

const routeTree = rootRoute.addChildren([loginRoute, homeRoute, adminRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
