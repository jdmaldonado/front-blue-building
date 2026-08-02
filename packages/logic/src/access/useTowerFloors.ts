import type { Floor } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { accessKeys } from './keys';

// Each floor carries the plan image where the door pins go.
export function useTowerFloors(towerId: string | null): UseQueryResult<Floor[]> {
  const { accessGateway } = useServices();

  return useQuery({
    queryKey: accessKeys.floors(towerId),
    queryFn: () => {
      if (towerId === null) {
        throw new Error('towerId is required');
      }
      return accessGateway.getTowerFloors(towerId);
    },
    enabled: towerId !== null,
  });
}
