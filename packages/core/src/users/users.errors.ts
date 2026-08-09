import { BadResponseError, DomainError } from '../shared';

export class UsersNetworkError extends DomainError {
  readonly code = 'USERS/NETWORK';
}

// The answer did not even have the shape of a list of users.
export class UsersBadResponseError extends BadResponseError {
  readonly code = 'USERS/BAD_RESPONSE';
}

// No user with that document. The API answers 404.
export class UserNotFoundError extends DomainError {
  readonly code = 'USERS/NOT_FOUND';
}

export class UnknownUsersError extends DomainError {
  readonly code = 'USERS/UNKNOWN';
}
