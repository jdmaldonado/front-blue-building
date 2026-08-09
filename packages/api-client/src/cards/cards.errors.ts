import {
  CardNotFoundError,
  CardsBadResponseError,
  CardsNetworkError,
  UnknownCardsError,
  UserNotVerifiedError,
} from '@bb/core';
import { z } from 'zod';
import type { HttpError } from '../http';
import { createErrorMapper, HttpStatus } from '../shared';

export const toCardsError = createErrorMapper({
  network: (cause) => new CardsNetworkError('Network error while reading cards', { cause }),
  badResponse: (cause) => new CardsBadResponseError('The cards answer has an unexpected shape', { cause }),
  unknown: (cause) => new UnknownCardsError('Unexpected error while working with cards', { cause }),
  byStatus: {
    [HttpStatus.NotFound]: (error) => new CardNotFoundError('Card no longer exists', { cause: error }),
    // 403 covers more than this, so the body decides.
    [HttpStatus.Forbidden]: (error) =>
      isUserNotVerified(error)
        ? new UserNotVerifiedError('User has no photo or document on file', { cause: error })
        : null,
  },
});

// The API refuses to create a card for a user without photo and document, and
// says so only in the body.
function isUserNotVerified(error: HttpError): boolean {
  const body = z.object({ error: z.string() }).catch({ error: '' }).parse(error.body);
  return body.error.includes('UserNotVerified');
}
