import { useSessionStore } from '@bb/logic';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { landingPathFor } from '../app/navigation';
import { LoginPage } from '../features/auth';

export const Route = createFileRoute('/login')({
  // Already signed in: no reason to show the form again.
  beforeLoad: () => {
    const { session } = useSessionStore.getState();
    if (session !== null) {
      throw redirect({ to: landingPathFor(session) });
    }
  },
  component: LoginPage,
});
