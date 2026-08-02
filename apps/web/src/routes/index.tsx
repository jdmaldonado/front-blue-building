import { createFileRoute, redirect } from '@tanstack/react-router';
import { useSessionStore } from '@bb/logic';
import { AppRoute, landingPathFor } from '../app/navigation';

// The root has no screen of its own: it sends each session to its area.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { session } = useSessionStore.getState();
    throw redirect({ to: session === null ? AppRoute.Login : landingPathFor(session) });
  },
});
