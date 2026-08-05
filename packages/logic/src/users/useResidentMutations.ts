import type { SetResidentActiveInput, UpdateResidentInput } from '@bb/core';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { userKeys } from './keys';

export interface ResidentMutations {
  update: UseMutationResult<void, Error, UpdateResidentInput>;
  setActive: UseMutationResult<void, Error, SetResidentActiveInput>;
}

export function useResidentMutations(): ResidentMutations {
  const { usersGateway } = useServices();
  const queryClient = useQueryClient();

  const invalidate = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: userKeys.all });
  };

  const update = useMutation({
    mutationFn: (input: UpdateResidentInput) => usersGateway.updateResident(input),
    onSuccess: invalidate,
  });

  const setActive = useMutation({
    mutationFn: (input: SetResidentActiveInput) => usersGateway.setResidentActive(input),
    onSuccess: invalidate,
  });

  return { update, setActive };
}
