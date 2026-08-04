import { Outlet, createFileRoute } from '@tanstack/react-router';
import { requireSuperUser } from '../app/guards';
import { AdminQuickSearch } from '../features/admin';

// One guard for the whole panel: any screen added under /admin inherits it.
export const Route = createFileRoute('/admin')({
  beforeLoad: requireSuperUser,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <AdminQuickSearch />
    </>
  );
}
