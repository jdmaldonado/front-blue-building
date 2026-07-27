import { useSessionStore } from '@bb/logic';
import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { LoginPage } from '../features/auth/LoginPage';
import { HomePage } from '../features/home/HomePage';

const rootRoute = createRootRoute({ component: Outlet });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (!useSessionStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: HomePage,
});

const routeTree = rootRoute.addChildren([loginRoute, homeRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
