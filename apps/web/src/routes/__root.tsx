import { useSocketConnection } from '@bb/logic';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({ component: RootComponent });

function RootComponent() {
  useSocketConnection();
  return <Outlet />;
}
