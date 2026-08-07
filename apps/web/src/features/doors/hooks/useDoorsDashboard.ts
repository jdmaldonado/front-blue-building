import { DoorStatus, findDoorByName, type Door, type DomainError, type Floor } from '@bb/core';
import {
  selectDoorStatus,
  selectReaderTelemetry,
  useAccessibleDoors,
  useDoorControl,
  useDoorStatuses,
  useTowerFloors,
  type ReaderTelemetry,
} from '@bb/logic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../../app/ToastProvider';
import type { TabItem } from '../../../ui';
import { DOOR_NOT_WIRED_MESSAGE, DOOR_NO_ANSWER_MESSAGE, doorErrorMessage } from '../lib';

// The API never says "the door opened". What it does send is the new state of
// the door, so that is what we wait for before telling the user it worked.
const OPEN_CONFIRMATION_TIMEOUT_MS = 8000;

type PendingOpen = {
  doorId: string;
  // The last event the door had before we asked. A different one means the
  // building answered.
  previousEventAt: string | number | null;
};

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
  // Set while an open order is waiting for the building to answer.
  openingDoorId: string | null;
  statusOf: (door: Door) => DoorStatus;
  // The hardware behind the door, when it has reported. A different question
  // from `statusOf`, and it comes from a different place.
  telemetryOf: (door: Door) => ReaderTelemetry | null;
  selectFloor: (floorId: string) => void;
  selectDoor: (doorId: string | null) => void;
  openDoor: (door: Door) => void;
}

// Everything the doors screen needs: which floor is on screen, which doors are
// on it, and their live status. The components only render the result.
//
// `initialDoorName` opens the screen with that door already selected, which is
// how the monitor sends someone to the camera of an event.
export function useDoorsDashboard(buildingId: string, initialDoorName?: string): DoorsDashboardController {
  const [floorId, setFloorId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const [pendingOpen, setPendingOpen] = useState<PendingOpen | null>(null);
  const [initialDoorApplied, setInitialDoorApplied] = useState(false);
  const toast = useToast();

  const doors = useAccessibleDoors(buildingId);
  const statuses = useDoorStatuses(buildingId);
  // Today all doors belong to the same tower, so the floors come from it.
  const towerId = doors.data?.[0]?.tower?.id ?? null;
  const floors = useTowerFloors(towerId);

  const onError = useCallback(
    (error: DomainError) => {
      setPendingOpen(null);
      toast({ tone: 'error', title: 'No pudimos abrir la puerta', message: doorErrorMessage(error) });
    },
    [toast],
  );

  const control = useDoorControl(
    buildingId,
    useMemo(() => ({ onError }), [onError]),
  );

  // Runs once, when the doors arrive. After that the screen belongs to whoever
  // is using it: reselecting on every render would fight their clicks. A door
  // the user cannot reach simply does not match, and the screen opens as usual.
  useEffect(() => {
    if (initialDoorApplied || initialDoorName === undefined || doors.data === undefined) {
      return;
    }
    setInitialDoorApplied(true);

    const target = findDoorByName(doors.data, initialDoorName);
    if (target === null) {
      return;
    }
    const targetFloorId = target.floor?.id ?? null;
    if (targetFloorId !== null) {
      setFloorId(targetFloorId);
    }
    setSelectedDoorId(target.id);
  }, [doors.data, initialDoorName, initialDoorApplied]);

  // A new event on the door is the building saying it acted.
  useEffect(() => {
    if (pendingOpen === null) {
      return;
    }
    const current = statuses.data?.[pendingOpen.doorId]?.lastEventTimestamp ?? null;
    if (current !== pendingOpen.previousEventAt) {
      setPendingOpen(null);
      toast({ tone: 'success', title: 'Puerta abierta', message: 'La orden llegó al edificio.' });
    }
  }, [statuses.data, pendingOpen, toast]);

  // Nothing came back. Saying so beats a spinner that never stops.
  useEffect(() => {
    if (pendingOpen === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPendingOpen(null);
      toast({ tone: 'warning', title: 'Sin confirmación', message: DOOR_NO_ANSWER_MESSAGE });
    }, OPEN_CONFIRMATION_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [pendingOpen, toast]);

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
    openingDoorId: pendingOpen?.doorId ?? null,
    statusOf: (door) => selectDoorStatus(statuses.data, door.id),
    telemetryOf: (door) => selectReaderTelemetry(statuses.data, door.id),
    selectFloor: setFloorId,
    selectDoor: setSelectedDoorId,
    openDoor: (door) => {
      // Doors without a local id are not wired to a reader yet.
      if (door.localId === null || door.localId === undefined) {
        toast({ tone: 'warning', title: 'Puerta sin equipo', message: DOOR_NOT_WIRED_MESSAGE });
        return;
      }
      setPendingOpen({ doorId: door.id, previousEventAt: statuses.data?.[door.id]?.lastEventTimestamp ?? null });
      control.openDoor(door.localId);
    },
  };
}
