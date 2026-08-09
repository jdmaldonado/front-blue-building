import type { Building } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { buildingKeys } from './buildings.keys';

// The API has no endpoint for a single building, so this reads the same list as
// `useBuildings` and picks one. Both share the cache entry.
export function useBuildingById(buildingId: string): UseQueryResult<Building | null> {
  const { buildingsGateway } = useServices();

  return useQuery({
    queryKey: buildingKeys.list(),
    queryFn: () => buildingsGateway.listBuildings(),
    select: (buildings) => buildings.find((building) => building.id === buildingId) ?? null,
  });
}
