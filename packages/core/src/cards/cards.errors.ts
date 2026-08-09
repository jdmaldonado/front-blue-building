import { BadResponseError, DomainError } from '../shared';

export class CardsNetworkError extends DomainError {
  readonly code = 'CARDS/NETWORK';
}

export class CardsBadResponseError extends BadResponseError {
  readonly code = 'CARDS/BAD_RESPONSE';
}

// The API refuses to create a card for a user without photo and document
// (api/src/2.0/cards/.../createCard:23).
export class UserNotVerifiedError extends DomainError {
  readonly code = 'CARDS/USER_NOT_VERIFIED';
}

export class CardNotFoundError extends DomainError {
  readonly code = 'CARDS/NOT_FOUND';
}

export class UnknownCardsError extends DomainError {
  readonly code = 'CARDS/UNKNOWN';
}

// The reader never answered, or answered with a problem.
export class CardReaderError extends DomainError {
  readonly code = 'CARDS/READER';
}
