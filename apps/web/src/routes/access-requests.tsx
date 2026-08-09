import { createFileRoute } from '@tanstack/react-router';
import { requireApprover } from '../app/guards';
import { useSessionBuilding } from '../app/BuildingContext';
import { AccessRequestsPage } from '../features/access-requests';
import { AppShell, AppTitle } from '../layouts/app';
import { ResidentMobileNav } from '../layouts/resident';

export const Route = createFileRoute('/access-requests')({
  beforeLoad: requireApprover,
  component: RouteComponent,
});

function RouteComponent() {
  const building = useSessionBuilding();

  return (
    <AppShell
      header={<AppTitle title="Solicitudes" subtitle="Quién pide entrar a tu espacio" />}
      mobileNav={building === null ? undefined : <ResidentMobileNav buildingId={building.id} />}
    >
      <AccessRequestsPage />
    </AppShell>
  );
}
