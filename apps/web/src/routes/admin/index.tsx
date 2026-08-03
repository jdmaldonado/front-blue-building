import { createFileRoute } from '@tanstack/react-router';
import { AdminBuildingsPage } from '../../features/admin';
import { AppShell, AppTitle } from '../../layouts/app';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppShell header={<AppTitle title="Edificios" subtitle="Elige uno para ver su dashboard" />}>
      <AdminBuildingsPage />
    </AppShell>
  );
}
