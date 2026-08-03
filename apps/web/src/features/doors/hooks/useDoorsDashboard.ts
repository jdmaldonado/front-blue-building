import { DoorStatus, type Door, type Floor } from '@bb/core';
import { selectDoorStatus, useAccessibleDoors, useDoorControl, useDoorStatuses, useTowerFloors } from '@bb/logic';
import { useMemo, useState } from 'react';
import type { SelectOption } from '../../../ui';

export interface DoorsDashboardController {
  isPending: boolean;
  isError: boolean;
  hasDoors: boolean;
  floorOptions: ReadonlyArray<SelectOption<string>>;
  currentFloorId: string | null;
  currentFloor: Floor | null;
  floorDoors: Door[];
  selectedDoor: Door | null;
  statusOf: (door: Door) => DoorStatus;
  selectFloor: (floorId: string) => void;
  selectDoor: (doorId: string | null) => void;
  openDoor: (door: Door) => void;
}

// Everything the doors screen needs: which floor is on screen, which doors are
// on it, and their live status. The components only render the result.
export function useDoorsDashboard(buildingId: string): DoorsDashboardController {
  const [floorId, setFloorId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);

  const doors = useAccessibleDoors(buildingId);
  const statuses = useDoorStatuses(buildingId);
  // Today all doors belong to the same tower, so the floors come from it.
  const towerId = doors.data?.[0]?.tower?.id ?? null;
  const floors = useTowerFloors(towerId);
  const control = useDoorControl(buildingId);

  // Default to the floor of the first door the user can reach: starting on a
  // floor with no doors looks like the plan is broken.
  const defaultFloorId = doors.data?.[0]?.floor?.id ?? floors.data?.[0]?.id ?? null;
  const currentFloorId = floorId ?? defaultFloorId;
  const currentFloor: Floor | null = floors.data?.find((floor) => floor.id === currentFloorId) ?? null;

  const floorDoors = useMemo(
    () => (doors.data ?? []).filter((door) => door.floor?.id === currentFloorId),
    [doors.data, currentFloorId],
  );

  const floorOptions: ReadonlyArray<SelectOption<string>> = useMemo(
    () =>
      (floors.data ?? []).map((floor) => {
        const count = (doors.data ?? []).filter((door) => door.floor?.id === floor.id).length;
        const name = floor.name ?? `Piso ${floor.id}`;
        return { value: floor.id, label: count > 0 ? `${name} (${count})` : name };
      }),
    [floors.data, doors.data],
  );

  return {
    isPending: doors.isPending,
    isError: doors.isError,
    hasDoors: (doors.data ?? []).length > 0,
    floorOptions,
    currentFloorId,
    currentFloor,
    floorDoors,
    selectedDoor: floorDoors.find((door) => door.id === selectedDoorId) ?? null,
    statusOf: (door) => selectDoorStatus(statuses.data, door.id),
    selectFloor: setFloorId,
    selectDoor: setSelectedDoorId,
    openDoor: (door) => {
      // Doors without a local id are not wired to a reader yet.
      if (door.localId !== null && door.localId !== undefined) {
        control.openDoor(door.localId);
      }
    },
  };
}
