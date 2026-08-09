import { LoginMode } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { redirectIfAuthenticated } from '../../app/guards';
import { LoginPage } from '../../features/auth';
import { AuthFrame } from '../../layouts/auth';

// Outside the auth route tree, so it can live under /admin. The parent route
// lets this one through: see the exception in admin.tsx.
export const Route = createFileRoute('/admin/login')({
  beforeLoad: redirectIfAuthenticated,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthFrame>
      <LoginPage mode={LoginMode.Admin} />
    </AuthFrame>
  );
}
