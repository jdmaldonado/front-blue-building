import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { AppRoute } from '../app/navigation';

// Compatibility route: the API email still links here
// (api/src/services/EmailService.ts:181). It only forwards to the real screen
// keeping the token, so links already sent keep working.
const searchSchema = z.object({
  token: z.string().catch(''),
});

export const Route = createFileRoute('/reset_password')({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    throw redirect({ to: AppRoute.ResetPassword, search: { token: search.token } });
  },
});
