import type { LoginInput, Session } from '@bb/core';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { useSessionStore } from '../session/store';

export interface UseLoginCallbacks {
  onSuccess?: (session: Session) => void;
  onError?: (error: unknown) => void;
}

export function useLogin(callbacks?: UseLoginCallbacks): UseMutationResult<Session, unknown, LoginInput> {
  const { authGateway, logger } = useServices();
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => authGateway.login(input),
    onSuccess: (session) => {
      setSession(session);
      callbacks?.onSuccess?.(session);
    },
    onError: (error) => {
      logger.error('Login failed', { error });
      callbacks?.onError?.(error);
    },
  });
}
