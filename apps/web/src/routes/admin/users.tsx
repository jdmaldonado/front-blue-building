import { createFileRoute } from '@tanstack/react-router';
import { ResidentsPage } from '../../features/users';
import { AppShell, AppTitle } from '../../layouts/app';

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppShell header={<AppTitle title="Usuarios" subtitle="Residentes de todos los edificios" />}>
      <ResidentsPage />
    </AppShell>
  );
}
