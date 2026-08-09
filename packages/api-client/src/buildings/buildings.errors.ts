import { BuildingsNetworkError, UnknownBuildingsError } from '@bb/core';
import { createErrorMapper } from '../shared';

// The API answers 401 both for a dead token and for a user who is not
// SUPER_USER (api/src/services/AuthService.ts:71-78). Both end the session
// here, which is the safe reading.
export const toBuildingsError = createErrorMapper({
  network: (cause) => new BuildingsNetworkError('Network error while reading buildings', { cause }),
  unknown: (cause) => new UnknownBuildingsError('Unexpected error while reading buildings', { cause }),
});
