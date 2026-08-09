export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

// The answer arrived but has a shape we do not understand. Asking again gives
// the same answer, so these are never retried.
export abstract class BadResponseError extends DomainError {}
