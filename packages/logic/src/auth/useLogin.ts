import type { LoginInput } from '@bb/api-client';
import type { LoginResponse } from '@bb/core';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { useSessionStore } from '../session/store';

export interface UseLoginCallbacks {
  onSuccess?: (session: LoginResponse) => void;
  onError?: (error: unknown) => void;
}

export function useLogin(callbacks?: UseLoginCallbacks): UseMutationResult<LoginResponse, unknown, LoginInput> {
  const { authGateway } = useServices();
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => authGateway.login(input),
    onSuccess: (session) => {
      setSession(session);
      callbacks?.onSuccess?.(session);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
