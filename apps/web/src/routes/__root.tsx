import { useSocketConnection } from '@bb/logic';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ConfirmProvider } from '../app/ConfirmProvider';
import { ToastProvider } from '../app/ToastProvider';

export const Route = createRootRoute({ component: RootComponent });

function RootComponent() {
  useSocketConnection();

  return (
    <ToastProvider>
      <ConfirmProvider>
        <Outlet />
      </ConfirmProvider>
    </ToastProvider>
  );
}
