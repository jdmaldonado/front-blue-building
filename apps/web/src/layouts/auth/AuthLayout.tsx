import { Outlet } from '@tanstack/react-router';
import { AuthFrame } from './AuthFrame';

// The frame for every public auth screen. The staff login lives outside this
// route tree and uses `AuthFrame` directly.
export function AuthLayout() {
  return (
    <AuthFrame>
      <Outlet />
    </AuthFrame>
  );
}
