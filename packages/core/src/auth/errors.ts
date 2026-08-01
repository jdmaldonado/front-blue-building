import { DomainError } from '../shared';

export class InvalidCredentialsError extends DomainError {
  readonly code = 'AUTH/INVALID_CREDENTIALS';
}

export class AuthNetworkError extends DomainError {
  readonly code = 'AUTH/NETWORK';
}

// The credentials are valid but the user has no apartment assigned, so there is
// nothing to show. The API answers 403 for this case.
export class NoSpacesAssignedError extends DomainError {
  readonly code = 'AUTH/NO_SPACES_ASSIGNED';
}

export class SessionExpiredError extends DomainError {
  readonly code = 'AUTH/SESSION_EXPIRED';
}

export class UnknownAuthError extends DomainError {
  readonly code = 'AUTH/UNKNOWN';
}
