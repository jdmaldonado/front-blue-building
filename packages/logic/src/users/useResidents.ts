import type { ResidentList } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { userKeys } from './users.keys';

// Every resident, or only those of one building when the screen belongs to one.
export function useResidents(buildingId?: string | null): UseQueryResult<ResidentList> {
  const { usersGateway } = useServices();

  return useQuery({
    queryKey: userKeys.residents(buildingId),
    queryFn: () => usersGateway.listResidents(buildingId),
  });
}

export function useApartmentResidents(apartmentId: string): UseQueryResult<ResidentList> {
  const { usersGateway } = useServices();

  return useQuery({
    queryKey: userKeys.byApartment(apartmentId),
    queryFn: () => usersGateway.listApartmentResidents(apartmentId),
  });
}
