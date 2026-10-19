import { DoorStatus, LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { useBuilding } from '../../app/BuildingContext';
import { PageSplash } from '../../app/PageSplash';
import { Alert, Loading, Tabs } from '../../ui';
import { CriticalAlerts, DoorDialog, FloorPlan } from './components';
import { useDoorsDashboard } from './hooks';

type DoorsDashboardPageProps = {
  // Name of the door to open with, when someone arrives here pointed at one.
  initialDoorName?: string;
};

export function DoorsDashboardPage({ initialDoorName }: DoorsDashboardPageProps) {
  const building = useBuilding();
  const dashboard = useDoorsDashboard(building.id, initialDoorName);
  const isResident = useSessionStore((state) => state.session?.mode === LoginMode.Usuario);

  if (dashboard.isPending) {
    // The panel opens this same screen, and there the brand splash would be out of place.
    return isResident ? <PageSplash /> : <Loading layout="screen" size="lg" label="Cargando puertas..." />;
  }

  if (dashboard.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar las puertas">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <CriticalAlerts />

      {dashboard.floorOptions.length > 1 && dashboard.currentFloorId !== null ? (
        <Tabs
          items={dashboard.floorOptions}
          value={dashboard.currentFloorId}
          onChange={dashboard.selectFloor}
          label="Piso"
          appearance="pill"
          className="max-w-full flex-none self-start"
        />
      ) : null}

      {dashboard.hasDoors ? (
        <FloorPlan
          floor={dashboard.currentFloor}
          doors={dashboard.floorDoors}
          statusOf={dashboard.statusOf}
          selectedDoorId={dashboard.selectedDoor?.id ?? null}
          onSelect={(door) => dashboard.selectDoor(door.id)}
          className="min-h-0 flex-1"
        />
      ) : (
        <Alert variant="info" title="Sin puertas asignadas">
          Tu usuario no tiene acceso a ninguna puerta de este edificio.
        </Alert>
      )}

      <DoorDialog
        door={dashboard.selectedDoor}
        status={dashboard.selectedDoor === null ? DoorStatus.Unknown : dashboard.statusOf(dashboard.selectedDoor)}
        buildingId={building.id}
        doors={dashboard.floorDoors}
        isOpening={dashboard.openingDoorId !== null && dashboard.openingDoorId === dashboard.selectedDoor?.id}
        telemetry={dashboard.selectedDoor === null ? null : dashboard.telemetryOf(dashboard.selectedDoor)}
        onClose={() => dashboard.selectDoor(null)}
        onSelectDoor={dashboard.selectDoor}
        onOpenDoor={dashboard.openDoor}
      />
    </div>
  );
}
