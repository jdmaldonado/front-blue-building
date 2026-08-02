import { DoorStatus, type Door, type Floor } from '@bb/core';
import { selectDoorStatus, useAccessibleDoors, useDoorControl, useDoorStatuses, useTowerFloors } from '@bb/logic';
import { useMemo, useState } from 'react';
import { useBuilding } from '../../app/BuildingContext';
import { Alert, Loading, Logo, RadioGroup, type RadioOption } from '../../ui';
import { DoorDialog, FloorPlan } from './components';

export function DoorsDashboardPage() {
  const building = useBuilding();
  const [floorId, setFloorId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);

  const doors = useAccessibleDoors(building.id);
  const statuses = useDoorStatuses(building.id);
  // Today all doors belong to the same tower, so the floors come from it.
  const towerId = doors.data?.[0]?.tower?.id ?? null;
  const floors = useTowerFloors(towerId);

  const { openDoor } = useDoorControl(building.id);

  const currentFloorId = floorId ?? floors.data?.[0]?.id ?? null;
  const currentFloor: Floor | null = floors.data?.find((floor) => floor.id === currentFloorId) ?? null;

  const floorDoors = useMemo(
    () => (doors.data ?? []).filter((door) => door.floor?.id === currentFloorId),
    [doors.data, currentFloorId],
  );

  const floorOptions: ReadonlyArray<RadioOption<string>> = useMemo(
    () => (floors.data ?? []).map((floor) => ({ value: floor.id, label: floor.name ?? `Piso ${floor.id}` })),
    [floors.data],
  );

  const selectedDoor: Door | null = floorDoors.find((door) => door.id === selectedDoorId) ?? null;
  const statusOf = (door: Door) => selectDoorStatus(statuses.data, door.id);

  if (doors.isPending) {
    return (
      <main className="bg-(--surface-base)">
        <Loading layout="screen" size="lg" label="Cargando puertas..." />
      </main>
    );
  }

  if (doors.isError) {
    return (
      <main className="min-h-dvh bg-(--surface-base) p-6">
        <Alert variant="error" title="No pudimos cargar las puertas">
          Revisa tu conexión e intenta de nuevo.
        </Alert>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col gap-4 bg-(--surface-base) p-4 text-(--text-primary) sm:p-6">
      <header className="flex flex-wrap items-center gap-3">
        <Logo size="sm" />
        <div className="flex flex-col">
          <span className="font-display text-title-sm font-bold tracking-tight">{building.name}</span>
          <span className="text-label text-(--text-muted)">
            {floorDoors.length} {floorDoors.length === 1 ? 'puerta' : 'puertas'} en este piso
          </span>
        </div>
      </header>

      {floorOptions.length > 1 && currentFloorId !== null ? (
        <RadioGroup
          appearance="segmented"
          label="Piso"
          options={floorOptions}
          value={currentFloorId}
          onChange={setFloorId}
          className="sm:max-w-md"
        />
      ) : null}

      {doors.data.length === 0 ? (
        <Alert variant="info" title="Sin puertas asignadas">
          Tu usuario no tiene acceso a ninguna puerta de este edificio.
        </Alert>
      ) : (
        <FloorPlan
          floor={currentFloor}
          doors={floorDoors}
          statusOf={statusOf}
          selectedDoorId={selectedDoorId}
          onSelect={(door) => setSelectedDoorId(door.id)}
          className="min-h-[320px] flex-1"
        />
      )}

      <DoorDialog
        door={selectedDoor}
        status={selectedDoor === null ? DoorStatus.Unknown : statusOf(selectedDoor)}
        buildingId={building.id}
        onClose={() => setSelectedDoorId(null)}
        onOpenDoor={(door) => {
          if (door.localId !== null && door.localId !== undefined) {
            openDoor(door.localId);
          }
        }}
      />
    </main>
  );
}
