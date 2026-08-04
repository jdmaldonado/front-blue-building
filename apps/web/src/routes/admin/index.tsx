import { createFileRoute } from '@tanstack/react-router';
import { BuildingsOverviewPage } from '../../features/admin';
import { AppShell, AppTitle } from '../../layouts/app';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppShell header={<AppTitle title="Edificios" subtitle="Estado de todos los edificios" />}>
      <BuildingsOverviewPage />
    </AppShell>
  );
}
