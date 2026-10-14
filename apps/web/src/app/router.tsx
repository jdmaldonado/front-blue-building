import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';
import { PageSplash } from './PageSplash';

const PENDING_MS = 200;

// The tree is generated from src/routes by @tanstack/router-plugin.
// A page that takes long to download shows the splash instead of a blank screen.
export const router = createRouter({
  routeTree,
  defaultPendingComponent: PageSplash,
  defaultPendingMs: PENDING_MS,
  defaultPendingMinMs: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
