import type { Door } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { accessKeys } from './keys';

// Every door of the building, to choose which reader goes into register mode.
export function useBuildingDoors(buildingId: string | null): UseQueryResult<Door[]> {
  const { accessGateway } = useServices();

  return useQuery({
    queryKey: accessKeys.buildingDoors(buildingId ?? ''),
    queryFn: () => accessGateway.listBuildingDoors(buildingId ?? ''),
    enabled: buildingId !== null && buildingId !== '',
  });
}
