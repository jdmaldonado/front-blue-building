import { createFileRoute, redirect } from '@tanstack/react-router';
import { useSessionStore } from '@bb/logic';
import { AppRoute, landingPathFor } from '../app/navigation';
import { AppKind, getAppConfig } from '../config';

// The root has no screen of its own: it sends each session to its area, and
// without one, to the login of this app. Installed apps open here.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { session } = useSessionStore.getState();
    if (session !== null) {
      throw redirect({ to: landingPathFor(session) });
    }
    throw redirect({ to: getAppConfig().kind === AppKind.Admin ? AppRoute.AdminLogin : AppRoute.Login });
  },
});
