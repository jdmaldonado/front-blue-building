export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

// The request arrived and the answer is not what we agreed on. Nothing to do
// with the network, so asking again gives the same answer: never retry these.
export abstract class ContractError extends DomainError {}
