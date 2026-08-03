import { LoginMode } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { BuildingProvider, useSessionBuilding } from '../app/BuildingContext';
import { requireMode } from '../app/guards';
import { DoorsDashboardPage } from '../features/doors';
import { AppShell, AppTitle } from '../layouts/app';
import { Alert } from '../ui';

// Resident entry. The admin panel reaches the same screen with the building
// taken from the route.
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireMode(LoginMode.Usuario),
  component: RouteComponent,
});

function RouteComponent() {
  const building = useSessionBuilding();

  if (building === null) {
    return (
      <AppShell header={<AppTitle title="Sin edificio" />}>
        <Alert variant="warning" title="Sin edificio asignado">
          Tu usuario no tiene un espacio asignado. Contacta al administrador de tu edificio.
        </Alert>
      </AppShell>
    );
  }

  return (
    <BuildingProvider building={building}>
      <AppShell header={<AppTitle title={building.name} />}>
        <DoorsDashboardPage />
      </AppShell>
    </BuildingProvider>
  );
}
