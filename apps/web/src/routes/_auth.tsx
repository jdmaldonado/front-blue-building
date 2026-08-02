import { createFileRoute } from '@tanstack/react-router';
import { redirectIfAuthenticated } from '../app/guards';
import { AuthLayout } from '../layouts/auth';

// Pathless layout route: `_auth` groups every public auth screen without adding
// a segment to the URL (`/login` stays `/login`). Guard and frame live here once,
// instead of repeated in each child route.
export const Route = createFileRoute('/_auth')({
  beforeLoad: redirectIfAuthenticated,
  component: AuthLayout,
});
