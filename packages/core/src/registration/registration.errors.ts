import { BadResponseError, DomainError } from '../shared';

export class RegistrationNetworkError extends DomainError {
  readonly code = 'REGISTRATION/NETWORK';
}

export class RegistrationBadResponseError extends BadResponseError {
  readonly code = 'REGISTRATION/BAD_RESPONSE';
}

// Somebody already registered with that document or that email. The API answers
// 422 naming the column (api/src/errors/UniqueConstraintError.ts:1-19).
export class DuplicateRegistrationError extends DomainError {
  readonly code = 'REGISTRATION/DUPLICATE';

  constructor(
    readonly field: 'cedula' | 'email' | null,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

// The API rejected a field. It answers 422 with the list of properties
// (api/src/errors/ValidationError.ts:1-13); we keep the names so the form can
// mark the right field instead of showing one long alert.
export class RegistrationRejectedError extends DomainError {
  readonly code = 'REGISTRATION/REJECTED';

  constructor(
    readonly fields: readonly string[],
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

export class ApartmentNotFoundError extends DomainError {
  readonly code = 'REGISTRATION/APARTMENT_NOT_FOUND';
}

// The apartment is not taking requests: it is inactive, which for a resident
// means nobody has claimed it as leader yet
// (api/src/controllers/apartments/users/controller.ts:47-49).
export class ApartmentClosedError extends DomainError {
  readonly code = 'REGISTRATION/APARTMENT_CLOSED';
}

export class UnknownRegistrationError extends DomainError {
  readonly code = 'REGISTRATION/UNKNOWN';
}
