import { ContractError, DomainError } from '../shared';

export class UsersNetworkError extends DomainError {
  readonly code = 'USERS/NETWORK';
}

// The answer did not even have the shape of a list of users.
export class UsersContractError extends ContractError {
  readonly code = 'USERS/CONTRACT';
}

export class UnknownUsersError extends DomainError {
  readonly code = 'USERS/UNKNOWN';
}
