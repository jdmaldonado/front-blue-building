import type { RegisterApartmentUserInput } from '@bb/api-client';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';

export interface UseRegisterCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useRegister(
  callbacks?: UseRegisterCallbacks,
): UseMutationResult<void, Error, RegisterApartmentUserInput> {
  const { registrationGateway } = useServices();

  return useMutation({
    mutationFn: (input: RegisterApartmentUserInput) => registrationGateway.register(input),
    onSuccess: () => callbacks?.onSuccess?.(),
    onError: (error) => callbacks?.onError?.(error),
  });
}
