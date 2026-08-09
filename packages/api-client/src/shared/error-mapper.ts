import { SessionExpiredError } from '@bb/core';
import { z } from 'zod';
import { HttpError } from '../http';
import { HttpStatus } from './http-status';

type MakeError = (cause: unknown) => Error;

// Returning null means "this is not that case after all": the shared rules
// below take over.
type MakeErrorFromStatus = (error: HttpError) => Error | null;

export interface ErrorRules {
  // No answer at all: the request never left, or never came back.
  network: MakeError;
  // An answer arrived with a shape we do not understand.
  badResponse?: MakeError;
  // Anything else.
  unknown: MakeError;
  // Cases this domain owns, by status code. Tried first.
  byStatus?: Partial<Record<number, MakeErrorFromStatus>>;
  // A 401 normally means the session died. Public endpoints turn this off.
  sessionCanExpire?: boolean;
}

// Every gateway translates the same four situations. Only the domain-specific
// ones change, so those are the only ones each gateway writes.
export function createErrorMapper(rules: ErrorRules): (error: unknown) => Error {
  return (error: unknown): Error => {
    if (rules.badResponse !== undefined && error instanceof z.ZodError) {
      return rules.badResponse(error);
    }

    if (error instanceof HttpError) {
      if (error.status === null) {
        return rules.network(error);
      }

      const fromStatus = rules.byStatus?.[error.status]?.(error) ?? null;
      if (fromStatus !== null) {
        return fromStatus;
      }

      if (error.status === HttpStatus.Unauthorized && rules.sessionCanExpire !== false) {
        return new SessionExpiredError('Session is no longer valid', { cause: error });
      }
    }

    return rules.unknown(error);
  };
}
