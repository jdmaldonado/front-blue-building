import { DomainError } from '../shared';

export class BuildingsNetworkError extends DomainError {
  readonly code = 'BUILDINGS/NETWORK';
}

export class UnknownBuildingsError extends DomainError {
  readonly code = 'BUILDINGS/UNKNOWN';
}
