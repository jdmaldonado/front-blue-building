import type { ResolveAccessRequestInput } from '@bb/core';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { accessRequestKeys } from './access-requests.keys';

export interface UseResolveAccessRequestCallbacks {
  onSuccess?: (input: ResolveAccessRequestInput) => void;
  onError?: (error: unknown) => void;
}

// Answered requests disappear from the list: the API marks them deleted either
// way (api/src/controllers/apartments/access/controller.ts:78-82).
export function useResolveAccessRequest(
  callbacks?: UseResolveAccessRequestCallbacks,
): UseMutationResult<void, Error, ResolveAccessRequestInput> {
  const { accessRequestsGateway } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ResolveAccessRequestInput) => accessRequestsGateway.resolve(input),
    onSuccess: async (_result, input) => {
      await queryClient.invalidateQueries({ queryKey: accessRequestKeys.list(input.scope, input.spaceId) });
      callbacks?.onSuccess?.(input);
    },
    onError: (error) => callbacks?.onError?.(error),
  });
}
