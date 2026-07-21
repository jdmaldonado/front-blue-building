import type { Door } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { accessKeys } from './keys';

export function useAccessibleDoors(buildingId: string | null): UseQueryResult<Door[]> {
  const { accessGateway } = useServices();

  return useQuery({
    queryKey: accessKeys.doors(buildingId),
    queryFn: () => {
      if (buildingId === null) {
        throw new Error('buildingId is required');
      }
      return accessGateway.getAccessibleDoors(buildingId);
    },
    enabled: buildingId !== null,
  });
}
