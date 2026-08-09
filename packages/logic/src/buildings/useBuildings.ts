import type { Building } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { buildingKeys } from './buildings.keys';

export function useBuildings(): UseQueryResult<Building[]> {
  const { buildingsGateway } = useServices();

  return useQuery({
    queryKey: buildingKeys.list(),
    queryFn: () => buildingsGateway.listBuildings(),
  });
}
