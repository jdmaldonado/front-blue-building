import { DomainError } from '../shared';

export class UnauthorizedDoorError extends DomainError {
  readonly code = 'ACCESS/UNAUTHORIZED';
}

export class OutOfScheduleError extends DomainError {
  readonly code = 'ACCESS/OUT_OF_SCHEDULE';
}

// Reserved for when the backend can report an unreachable RPI distinctly. Today
// the API answers `AuthorizationError` for both no-permission and RPI-down.
export class RpiUnavailableError extends DomainError {
  readonly code = 'ACCESS/RPI_UNAVAILABLE';
}
