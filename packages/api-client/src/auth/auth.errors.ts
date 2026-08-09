import {
  AuthNetworkError,
  InvalidCredentialsError,
  InvalidResetTokenError,
  NoSpacesAssignedError,
  UnknownAuthError,
  WeakPasswordError,
} from '@bb/core';
import { createErrorMapper, HttpStatus } from '../shared';

// Nobody is logged in yet, so a 401 here is a wrong password, not a dead
// session.
export const toAuthError = createErrorMapper({
  network: (cause) => new AuthNetworkError('Network error during login', { cause }),
  unknown: (cause) => new UnknownAuthError('Unexpected login error', { cause }),
  sessionCanExpire: false,
  byStatus: {
    [HttpStatus.BadRequest]: () => new InvalidCredentialsError('Invalid credentials'),
    [HttpStatus.Unauthorized]: () => new InvalidCredentialsError('Invalid credentials'),
    // Valid user, but no apartment assigned.
    [HttpStatus.Forbidden]: () => new NoSpacesAssignedError('User has no spaces assigned'),
  },
});

export const toResetPasswordError = createErrorMapper({
  network: (cause) => new AuthNetworkError('Network error during password reset', { cause }),
  unknown: (cause) => new UnknownAuthError('Unexpected password reset error', { cause }),
  sessionCanExpire: false,
  byStatus: {
    // The token is unknown, expired or already used.
    [HttpStatus.Forbidden]: () => new InvalidResetTokenError('Reset token is no longer valid'),
    [HttpStatus.Unprocessable]: () => new WeakPasswordError('Password is shorter than the minimum'),
    [HttpStatus.BadRequest]: () => new WeakPasswordError('Password is shorter than the minimum'),
  },
});
