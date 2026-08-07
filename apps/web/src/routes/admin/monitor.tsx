import { MonitorSearchSchema } from '@bb/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MonitorPage } from '../../features/monitor';
import { AppShell, AppTitle } from '../../layouts/app';

// Global by default: whoever watches looks at everything and narrows down to a
// building when something happens.
export const Route = createFileRoute('/admin/monitor')({
  validateSearch: MonitorSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  return (
    <AppShell header={<AppTitle title="Monitoreo" subtitle="Eventos de todos los edificios" />}>
      <MonitorPage search={search} onSearchChange={(next) => void navigate({ to: '/admin/monitor', search: next })} />
    </AppShell>
  );
}
