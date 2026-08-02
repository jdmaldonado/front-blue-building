import { doorStatusFromEvent, type DoorStatus, type DoorStatuses } from '@bb/core';
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

    return socketClient.onDoorUpdate(buildingId, (update) => {
      queryClient.setQueryData<DoorStatuses>(queryKey, (current) => ({
        ...current,
        [update.doorId]: update.event,
      }));
    });
  }, [buildingId, socketClient, queryClient]);

  return query;
}

// So no view repeats the "no entry means unknown" rule.
export function selectDoorStatus(statuses: DoorStatuses | undefined, doorId: string): DoorStatus {
  return doorStatusFromEvent(statuses?.[doorId]?.eventType);
}
