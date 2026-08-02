import { LoginMode } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { BuildingProvider, useSessionBuilding } from '../app/BuildingContext';
import { requireMode } from '../app/guards';
import { DoorsDashboardPage } from '../features/doors';
import { Alert } from '../ui';

// Resident entry. The admin panel will reach the same screen with the building
// taken from the route.
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireMode(LoginMode.Usuario),
  component: RouteComponent,
});

function RouteComponent() {
  const building = useSessionBuilding();

  if (building === null) {
    return (
      <main className="min-h-dvh bg-(--surface-base) p-6">
        <Alert variant="warning" title="Sin edificio asignado">
          Tu usuario no tiene un espacio asignado. Contacta al administrador de tu edificio.
        </Alert>
      </main>
    );
  }

  return (
    <BuildingProvider building={building}>
      <DoorsDashboardPage />
    </BuildingProvider>
  );
}
