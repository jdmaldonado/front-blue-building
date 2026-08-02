import type { ForgotPasswordInput, ResetPasswordInput } from '@bb/core';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';

export interface PasswordRecoveryCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

// Step 1: ask for the email with the reset link. A success here does not mean the
// document exists; the API answers the same either way.
export function useForgotPassword(
  callbacks?: PasswordRecoveryCallbacks,
): UseMutationResult<void, unknown, ForgotPasswordInput> {
  const { authGateway, logger } = useServices();

  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authGateway.forgotPassword(input),
    onSuccess: () => callbacks?.onSuccess?.(),
    onError: (error) => {
      logger.error('Forgot password request failed', { error });
      callbacks?.onError?.(error);
    },
  });
}

// Step 2: set the new password with the token from the email link.
export function useResetPassword(
  callbacks?: PasswordRecoveryCallbacks,
): UseMutationResult<void, unknown, ResetPasswordInput> {
  const { authGateway, logger } = useServices();

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authGateway.resetPassword(input),
    onSuccess: () => callbacks?.onSuccess?.(),
    onError: (error) => {
      logger.error('Password reset failed', { error });
      callbacks?.onError?.(error);
    },
  });
}
