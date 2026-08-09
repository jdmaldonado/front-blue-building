import { LoginMode } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '../../features/auth';

// The resident door. The staff one is /admin/login, and neither mentions the
// other: a resident picking "administrador" by mistake only got an error.
export const Route = createFileRoute('/_auth/login')({
  component: () => <LoginPage mode={LoginMode.Usuario} />,
});
