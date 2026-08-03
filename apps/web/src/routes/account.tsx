import { createFileRoute } from '@tanstack/react-router';
import { requireSession } from '../app/guards';
import { AccountPage } from '../features/account';
import { AppShell, AppTitle } from '../layouts/app';

export const Route = createFileRoute('/account')({
  beforeLoad: requireSession,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppShell header={<AppTitle title="Perfil" subtitle="Tus datos y tu sesión" />}>
      <AccountPage />
    </AppShell>
  );
}
