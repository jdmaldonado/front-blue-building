import { Outlet, createFileRoute } from '@tanstack/react-router';

// Layout only. The list lives in `apartments.index.tsx`, because the residents
// of an apartment hang below this path and need somewhere to render.
export const Route = createFileRoute('/admin/buildings/$buildingId/apartments')({
  component: Outlet,
});
