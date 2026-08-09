import type { ResidentList } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { userKeys } from './users.keys';

export function useResidents(): UseQueryResult<ResidentList> {
  const { usersGateway } = useServices();

  return useQuery({
    queryKey: userKeys.residents(),
    queryFn: () => usersGateway.listResidents(),
  });
}

// Same table, narrower source. The API has no "users of a building" endpoint,
// so a building screen filters the full list by name.
export function useApartmentResidents(apartmentId: string): UseQueryResult<ResidentList> {
  const { usersGateway } = useServices();

  return useQuery({
    queryKey: userKeys.byApartment(apartmentId),
    queryFn: () => usersGateway.listApartmentResidents(apartmentId),
  });
}
