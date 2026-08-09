import {
  ApartmentClosedError,
  ApartmentNotFoundError,
  DuplicateRegistrationError,
  RegistrationBadResponseError,
  RegistrationNetworkError,
  RegistrationRejectedError,
  UnknownRegistrationError,
} from '@bb/core';
import { z } from 'zod';
import type { HttpError } from '../http';
import { createErrorMapper, HttpStatus } from '../shared';

// What the API sends when it refuses a form: a list of properties, either from
// its validator or from a unique index (api/src/errors/ValidationError.ts:1,
// api/src/errors/UniqueConstraintError.ts:1).
const RejectedFieldsSchema = z.object({
  errors: z.array(z.object({ property: z.string(), message: z.string() })),
});

// Nobody is logged in here, so a 401 has nothing to do with a dead session.
export const toRegistrationError = createErrorMapper({
  network: (cause) => new RegistrationNetworkError('Network error while registering', { cause }),
  badResponse: (cause) => new RegistrationBadResponseError('The answer has an unexpected shape', { cause }),
  unknown: (cause) => new UnknownRegistrationError('Unexpected error while registering', { cause }),
  sessionCanExpire: false,
  byStatus: {
    [HttpStatus.NotFound]: (error) => new ApartmentNotFoundError('That apartment no longer exists', { cause: error }),
    [HttpStatus.Forbidden]: (error) =>
      new ApartmentClosedError('The apartment is not taking requests', { cause: error }),
    [HttpStatus.Unprocessable]: toRejectedError,
  },
});

function toRejectedError(error: HttpError): Error {
  const body = RejectedFieldsSchema.safeParse(error.body);
  if (!body.success) {
    return new RegistrationRejectedError([], 'The API rejected the form', { cause: error });
  }

  const duplicate = body.data.errors.find((item) => item.message.includes('already exists'));
  if (duplicate) {
    const field = duplicate.property === 'cedula' || duplicate.property === 'email' ? duplicate.property : null;
    return new DuplicateRegistrationError(field, 'Somebody registered with that value already', { cause: error });
  }

  return new RegistrationRejectedError(
    body.data.errors.map((item) => item.property),
    'The API rejected the form',
    { cause: error },
  );
}
