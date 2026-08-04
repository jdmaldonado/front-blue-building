import { useBuildingById } from '@bb/logic';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { BuildingProvider } from '../../app/BuildingContext';
import { BuildingHeader, BuildingSectionNav } from '../../features/admin';
import { AppShell, AppTitle } from '../../layouts/app';
import { Alert, Loading } from '../../ui';

// Frame shared by every screen of one building: it loads it once and puts it in
// context, so the sections below only read it.
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
        header={<BuildingHeader building={building.data} />}
        sectionNav={({ collapsed, onNavigate }) => (
          <BuildingSectionNav buildingId={buildingId} collapsed={collapsed} onNavigate={onNavigate} />
        )}
      >
        <Outlet />
      </AppShell>
    </BuildingProvider>
  );
}
