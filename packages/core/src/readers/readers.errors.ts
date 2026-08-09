import { DomainError } from '../shared';

// The API could not reach the reader: "No socket found".
export class ReaderUnreachableError extends DomainError {
  readonly code = 'READERS/UNREACHABLE';
}

// Nobody answered within the reboot window.
export class ReaderTimeoutError extends DomainError {
  readonly code = 'READERS/TIMEOUT';
}

export class UnknownReaderError extends DomainError {
  readonly code = 'READERS/UNKNOWN';
}
