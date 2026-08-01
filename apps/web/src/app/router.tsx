import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';

// The tree is generated from src/routes by @tanstack/router-plugin.
export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
