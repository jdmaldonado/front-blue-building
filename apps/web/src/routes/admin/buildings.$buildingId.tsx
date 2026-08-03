import { useBuildingById } from '@bb/logic';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { BuildingProvider } from '../../app/BuildingContext';
import { AppRoute } from '../../app/navigation';
import { BuildingEventsButton } from '../../features/building-events';
import { DoorsDashboardPage } from '../../features/doors';
import { AppShell, AppTitle } from '../../layouts/app';
import { Alert, IconButton, Loading } from '../../ui';

// Same dashboard as the resident one. Here the building comes from the route.
export const Route = createFileRoute('/admin/buildings/$buildingId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { buildingId } = Route.useParams();
  const building = useBuildingById(buildingId);

  if (building.isPending) {
    return <Loading layout="screen" label="Cargando edificio..." />;
  }

  if (building.data === null || building.data === undefined) {
    return (
      <AppShell header={<AppTitle title="Edificio no encontrado" />}>
        <Alert variant="error" title="Edificio no encontrado">
          Vuelve a la lista y elige otro.
        </Alert>
      </AppShell>
    );
  }

  return (
    <BuildingProvider building={building.data}>
      <AppShell
        header={
          <>
            <Link to={AppRoute.Admin}>
              <IconButton label="Volver a edificios">
                <ArrowLeft size={18} />
              </IconButton>
            </Link>
            <AppTitle title={building.data.name} />
          </>
        }
        headerActions={<BuildingEventsButton buildingId={building.data.id} />}
      >
        <DoorsDashboardPage />
      </AppShell>
    </BuildingProvider>
  );
}
