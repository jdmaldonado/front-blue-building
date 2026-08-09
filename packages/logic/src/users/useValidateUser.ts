import type { ValidateUserInput } from '@bb/api-client';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { userKeys } from './users.keys';

// Photo and both sides of the document. Until this succeeds the API refuses to
// create cards for the person.
export function useValidateUser(): UseMutationResult<void, Error, ValidateUserInput> {
  const { usersGateway } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ValidateUserInput) => usersGateway.validate(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
