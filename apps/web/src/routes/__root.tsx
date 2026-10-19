import { useSocketConnection } from '@bb/logic';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ConfirmProvider } from '../app/ConfirmProvider';
import { ToastProvider } from '../app/ToastProvider';
import { useResidentTextSize } from '../app/useResidentTextSize';

export const Route = createRootRoute({ component: RootComponent });

function RootComponent() {
  useSocketConnection();
  useResidentTextSize();

  return (
    <ToastProvider>
      <ConfirmProvider>
        <Outlet />
      </ConfirmProvider>
    </ToastProvider>
  );
}
