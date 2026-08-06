import {
  doorStatusFromEvent,
  isReaderTelemetry,
  mergeDoorEvent,
  type DoorStatus,
  type DoorStatuses,
  type ReaderState,
} from '@bb/core';
import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useServices } from '../services/context';
import { accessKeys } from './keys';

// First an HTTP read, then socket updates merged into the same cache entry.
export function useDoorStatuses(buildingId: string | null): UseQueryResult<DoorStatuses> {
  const { accessGateway, socketClient } = useServices();
  const queryClient = useQueryClient();
  const queryKey = accessKeys.doorStatuses(buildingId);

  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (buildingId === null) {
        throw new Error('buildingId is required');
      }
      return accessGateway.getDoorStatuses(buildingId);
    },
    enabled: buildingId !== null,
  });

  useEffect(() => {
    if (buildingId === null) {
      return;
    }

    socketClient.subscribeDoorStatus(buildingId);

    const unsubscribe = socketClient.onDoorUpdate(buildingId, (update) => {
      queryClient.setQueryData<DoorStatuses>(queryKey, (current) => ({
        ...current,
        [update.doorId]: mergeDoorEvent(current?.[update.doorId], update.event),
      }));
    });

    return () => {
      unsubscribe();
      socketClient.leaveDoorStatus(buildingId);
    };
  }, [buildingId, socketClient, queryClient]);

  return query;
}

// Two things live in the same map because the API sends them on the same event,
// but they answer different questions and come from different places:
//
//   selectDoorStatus     -> is the door open? Comes from door events.
//   selectReaderTelemetry-> how is the hardware? Comes from MQTT telemetry.
//
// A view asks for the one it needs instead of digging into the raw entry.

// So no view repeats the "no entry means unknown" rule.
export function selectDoorStatus(statuses: DoorStatuses | undefined, doorId: string): DoorStatus {
  return doorStatusFromEvent(statuses?.[doorId]?.eventType);
}

export interface ReaderTelemetry {
  masterStatus: string | null;
  slaveStatus: string | null;
  masterSpiOk: boolean | null;
  slaveSpiOk: boolean | null;
  deviceType: string | null;
  reportedAt: number | null;
  state: ReaderState | null;
}

// Null when this door has never reported hardware: either it has no reader, or
// nothing has changed since we subscribed. The API has no way to ask for it.
export function selectReaderTelemetry(statuses: DoorStatuses | undefined, doorId: string): ReaderTelemetry | null {
  const event = statuses?.[doorId];
  if (event === undefined || !isReaderTelemetry(event)) {
    return null;
  }

  return {
    masterStatus: event.masterStatus ?? null,
    slaveStatus: event.slaveStatus ?? null,
    masterSpiOk: event.masterSpiOk ?? null,
    slaveSpiOk: event.slaveSpiOk ?? null,
    deviceType: event.deviceType ?? null,
    reportedAt: event.lastTelemetryTimestamp ?? null,
    state: event.readerState ?? null,
  };
}
