import { Outlet, createFileRoute, useMatchRoute } from '@tanstack/react-router';
import { requireSuperUser } from '../app/guards';
import { AppRoute } from '../app/navigation';
import { AdminQuickSearch } from '../features/admin';

// One guard for the whole panel: any screen added under /admin inherits it.
// The login is the exception, or nobody could ever reach it.
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
    if (location.pathname === AppRoute.AdminLogin) {
      return;
    }
    requireSuperUser();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const matchRoute = useMatchRoute();
  const onLogin = matchRoute({ to: AppRoute.AdminLogin }) !== false;

  return (
    <>
      <Outlet />
      {/* The panel chrome has no business on the login screen. */}
      {onLogin ? null : <AdminQuickSearch />}
    </>
  );
}
