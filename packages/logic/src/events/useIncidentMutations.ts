import type { ResolveIncidentInput, StartIncidentInput } from '@bb/core';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { eventKeys } from './events.keys';

export interface IncidentMutations {
  start: UseMutationResult<void, Error, StartIncidentInput>;
  resolve: UseMutationResult<void, Error, ResolveIncidentInput>;
}

export function useIncidentMutations(): IncidentMutations {
  const { eventsGateway } = useServices();
  const queryClient = useQueryClient();

  const invalidate = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: eventKeys.all });
  };

  const start = useMutation({
    mutationFn: (input: StartIncidentInput) => eventsGateway.startIncident(input),
    onSuccess: invalidate,
  });

  const resolve = useMutation({
    mutationFn: (input: ResolveIncidentInput) => eventsGateway.resolveIncident(input),
    onSuccess: invalidate,
  });

  return { start, resolve };
}
