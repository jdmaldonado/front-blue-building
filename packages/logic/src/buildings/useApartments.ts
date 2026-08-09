import type { RetireApartmentInput } from '@bb/api-client';
import type { Apartment } from '@bb/core';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useServices } from '../services/context';
import { buildingKeys } from './buildings.keys';

// Null when the caller does not need them yet: the breadcrumb only asks for the
// list when it has an apartment to name.
export function useApartments(buildingId: string | null): UseQueryResult<Apartment[]> {
  const { buildingsGateway } = useServices();

  return useQuery({
    queryKey: buildingKeys.apartments(buildingId ?? ''),
    queryFn: () => buildingsGateway.listApartments(buildingId ?? ''),
    enabled: buildingId !== null && buildingId !== '',
  });
}

// The old panel showed success and left a stale list on screen. Here the list
// is refetched, so what you see is what happened.
export function useRetireApartment(): UseMutationResult<void, Error, RetireApartmentInput> {
  const { buildingsGateway } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RetireApartmentInput) => buildingsGateway.retireApartment(input),
    onSuccess: async (_result, input) => {
      await queryClient.invalidateQueries({ queryKey: buildingKeys.apartments(input.buildingId) });
    },
  });
}
