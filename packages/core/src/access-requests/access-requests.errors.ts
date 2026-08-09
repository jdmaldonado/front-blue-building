import { BadResponseError, DomainError } from '../shared';

export class AccessRequestsNetworkError extends DomainError {
  readonly code = 'ACCESS_REQUESTS/NETWORK';
}

export class AccessRequestsBadResponseError extends BadResponseError {
  readonly code = 'ACCESS_REQUESTS/BAD_RESPONSE';
}

// The request is gone: somebody already answered it, or it was never ours.
export class AccessRequestGoneError extends DomainError {
  readonly code = 'ACCESS_REQUESTS/GONE';
}

// The approver's own account is not verified yet, so the API refuses
// (api/src/controllers/apartments/access/controller.ts:23-26).
export class ApproverNotVerifiedError extends DomainError {
  readonly code = 'ACCESS_REQUESTS/APPROVER_NOT_VERIFIED';
}

// The API answers 500 with a plain message when the apartment is full, and with
// no code to tell that apart from any other failure (:52-54).
export class AccessRequestFailedError extends DomainError {
  readonly code = 'ACCESS_REQUESTS/FAILED';
}

export class UnknownAccessRequestsError extends DomainError {
  readonly code = 'ACCESS_REQUESTS/UNKNOWN';
}
