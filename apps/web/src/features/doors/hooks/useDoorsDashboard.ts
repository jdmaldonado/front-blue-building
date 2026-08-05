import { DoorStatus, type Door, type Floor } from '@bb/core';
import { selectDoorStatus, useAccessibleDoors, useDoorControl, useDoorStatuses, useTowerFloors } from '@bb/logic';
import { useMemo, useState } from 'react';
import type { TabItem } from '../../../ui';

export interface DoorsDashboardController {
  isPending: boolean;
  isError: boolean;
  hasDoors: boolean;
  floorOptions: ReadonlyArray<TabItem<string>>;
  currentFloorId: string | null;
  currentFloor: Floor | null;
  floorDoors: Door[];
  selectedDoor: Door | null;
  // The doors on either side of the selected one, to move without closing the
  // dialog. Null at the ends: the list does not wrap around.
  previousDoor: Door | null;
  nextDoor: Door | null;
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

  // A floor with no doors has nothing to offer here, not even a plan to look at.
  const floorOptions: ReadonlyArray<TabItem<string>> = useMemo(
    () =>
      (floors.data ?? [])
        .filter((floor) => (doors.data ?? []).some((door) => door.floor?.id === floor.id))
        .map((floor) => ({ value: floor.id, label: floor.name ?? `Piso ${floor.id}` })),
    [floors.data, doors.data],
  );

  // Default to the floor of the first door the user can reach: starting on a
  // floor with no doors looks like the plan is broken.
  const defaultFloorId = doors.data?.[0]?.floor?.id ?? floorOptions[0]?.value ?? null;
  const currentFloorId = floorId ?? defaultFloorId;
  const currentFloor: Floor | null = floors.data?.find((floor) => floor.id === currentFloorId) ?? null;

  const floorDoors = useMemo(
    () => (doors.data ?? []).filter((door) => door.floor?.id === currentFloorId),
    [doors.data, currentFloorId],
  );

  const selectedIndex = floorDoors.findIndex((door) => door.id === selectedDoorId);

  return {
    isPending: doors.isPending,
    isError: doors.isError,
    hasDoors: (doors.data ?? []).length > 0,
    floorOptions,
    currentFloorId,
    currentFloor,
    floorDoors,
    selectedDoor: floorDoors[selectedIndex] ?? null,
    previousDoor: selectedIndex > 0 ? (floorDoors[selectedIndex - 1] ?? null) : null,
    nextDoor: selectedIndex >= 0 ? (floorDoors[selectedIndex + 1] ?? null) : null,
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
