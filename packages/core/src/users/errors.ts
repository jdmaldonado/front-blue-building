import { DomainError } from '../shared';

export class UsersNetworkError extends DomainError {
  readonly code = 'USERS/NETWORK';
}

export class UnknownUsersError extends DomainError {
  readonly code = 'USERS/UNKNOWN';
}
