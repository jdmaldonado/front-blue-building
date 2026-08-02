import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ResetPasswordPage } from '../../features/auth';

// The URL is a border: it comes from an email the user may have mangled. A
// missing token degrades to an empty string and the page explains it, instead of
// throwing a router error.
const searchSchema = z.object({
  token: z.string().catch(''),
});

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return <ResetPasswordPage token={token} />;
}
