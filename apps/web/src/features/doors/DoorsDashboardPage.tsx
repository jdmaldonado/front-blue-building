import { DoorStatus } from '@bb/core';
import { useBuilding } from '../../app/BuildingContext';
import { Alert, Loading, Select } from '../../ui';
import { DoorDialog, FloorPlan } from './components';
import { useDoorsDashboard } from './hooks';

export function DoorsDashboardPage() {
  const building = useBuilding();
  const dashboard = useDoorsDashboard(building.id);

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
          <Select
            aria-label="Piso"
            options={dashboard.floorOptions}
            value={dashboard.currentFloorId}
            onChange={dashboard.selectFloor}
            className="w-full sm:max-w-xs"
          />
        ) : null}
        <span className="text-label text-(--text-muted)">
          {doorCount} {doorCount === 1 ? 'puerta' : 'puertas'} en este piso
        </span>
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
        onClose={() => dashboard.selectDoor(null)}
        onOpenDoor={dashboard.openDoor}
      />
    </div>
  );
}
