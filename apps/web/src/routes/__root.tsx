import { useSocketConnection } from '@bb/logic';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ConfirmProvider } from '../app/ConfirmProvider';

export const Route = createRootRoute({ component: RootComponent });

function RootComponent() {
  useSocketConnection();

  return (
    <ConfirmProvider>
      <Outlet />
    </ConfirmProvider>
  );
}
