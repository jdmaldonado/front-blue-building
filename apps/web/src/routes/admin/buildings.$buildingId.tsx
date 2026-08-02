import { useBuildings } from '@bb/logic';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { BuildingProvider } from '../../app/BuildingContext';
import { DoorsDashboardPage } from '../../features/doors';
import { AppRoute } from '../../app/navigation';
import { Alert, IconButton, Loading } from '../../ui';

// Same dashboard as the resident one. Here the building comes from the route.
export const Route = createFileRoute('/admin/buildings/$buildingId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { buildingId } = Route.useParams();
  const buildings = useBuildings();

  if (buildings.isPending) {
    return <Loading layout="screen" label="Cargando edificio..." />;
  }

  const building = buildings.data?.find((item) => item.id === buildingId) ?? null;

  if (building === null) {
    return (
      <main className="min-h-dvh bg-(--surface-base) p-6">
        <Alert variant="error" title="Edificio no encontrado">
          Vuelve a la lista y elige otro.
        </Alert>
      </main>
    );
  }

  return (
    <BuildingProvider building={building}>
      <DoorsDashboardPage
        headerAction={
          <Link to={AppRoute.Admin}>
            <IconButton label="Volver a edificios">
              <ArrowLeft size={18} />
            </IconButton>
          </Link>
        }
      />
    </BuildingProvider>
  );
}
