import { DomainError } from '../shared';

export class InvalidCredentialsError extends DomainError {
  readonly code = 'AUTH/INVALID_CREDENTIALS';
}

export class AuthNetworkError extends DomainError {
  readonly code = 'AUTH/NETWORK';
}

export class SessionExpiredError extends DomainError {
  readonly code = 'AUTH/SESSION_EXPIRED';
}

export class UnknownAuthError extends DomainError {
  readonly code = 'AUTH/UNKNOWN';
}
