import {
  AccessRequestFailedError,
  AccessRequestGoneError,
  AccessRequestsBadResponseError,
  AccessRequestsNetworkError,
  ApproverNotVerifiedError,
  UnknownAccessRequestsError,
} from '@bb/core';
import { z } from 'zod';
import type { HttpError } from '../http';
import { createErrorMapper, HttpStatus } from '../shared';

// The API serialises its errors with a `name` and nothing else useful
// (api/src/errors/ApartmentAccessRequestError.ts:5-11).
const NamedErrorSchema = z.object({ name: z.string() }).catch({ name: '' });

const INTERNAL_ERROR = 500;

export const toAccessRequestsError = createErrorMapper({
  network: (cause) => new AccessRequestsNetworkError('Network error while reading access requests', { cause }),
  badResponse: (cause) => new AccessRequestsBadResponseError('The answer has an unexpected shape', { cause }),
  unknown: (cause) => new UnknownAccessRequestsError('Unexpected error with an access request', { cause }),
  byStatus: {
    // Two different things answer 403 here, and only the body tells them apart.
    [HttpStatus.Forbidden]: (error) => {
      if (isNamed(error, 'UserNotVerifiedError')) {
        return new ApproverNotVerifiedError('The approver is not verified yet', { cause: error });
      }
      if (isNamed(error, 'MaxCapacityReachedError')) {
        return new AccessRequestFailedError('The apartment is full', { cause: error });
      }
      return new AccessRequestGoneError('That request is no longer available', { cause: error });
    },
    // An API without the fix still answers 500 for the full apartment, with the
    // reason only in the text. Kept until every environment is updated.
    [INTERNAL_ERROR]: (error) =>
      new AccessRequestFailedError('The API refused to resolve the request', { cause: error }),
  },
});

function isNamed(error: HttpError, name: string): boolean {
  return NamedErrorSchema.parse(error.body).name === name;
}
