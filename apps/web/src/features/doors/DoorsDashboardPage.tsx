import { DoorStatus } from '@bb/core';
import { useBuilding } from '../../app/BuildingContext';
import { Alert, Loading, Tabs, Text } from '../../ui';
import { DoorDialog, FloorPlan } from './components';
import { useDoorsDashboard } from './hooks';

type DoorsDashboardPageProps = {
  // Name of the door to open with, when someone arrives here pointed at one.
  initialDoorName?: string;
};

export function DoorsDashboardPage({ initialDoorName }: DoorsDashboardPageProps) {
  const building = useBuilding();
  const dashboard = useDoorsDashboard(building.id, initialDoorName);

  if (dashboard.isPending) {
    return <Loading layout="screen" size="lg" label="Cargando puertas..." />;
  }

  if (dashboard.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar las puertas">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  const doorCount = dashboard.floorDoors.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-none flex-wrap items-center gap-3">
        {dashboard.floorOptions.length > 1 && dashboard.currentFloorId !== null ? (
          <Tabs
            items={dashboard.floorOptions}
            value={dashboard.currentFloorId}
            onChange={dashboard.selectFloor}
            label="Piso"
            appearance="pill"
            className="max-w-full"
          />
        ) : null}
        <Text as="span" size="label" tone="muted">
          {doorCount} {doorCount === 1 ? 'puerta' : 'puertas'} en este piso
        </Text>
      </div>

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
        previousDoor={dashboard.previousDoor}
        nextDoor={dashboard.nextDoor}
        isOpening={dashboard.openingDoorId !== null && dashboard.openingDoorId === dashboard.selectedDoor?.id}
        telemetry={dashboard.selectedDoor === null ? null : dashboard.telemetryOf(dashboard.selectedDoor)}
        onClose={() => dashboard.selectDoor(null)}
        onSelectDoor={dashboard.selectDoor}
        onOpenDoor={dashboard.openDoor}
      />
    </div>
  );
}
