import { BadResponseError, DomainError } from '../shared';

export class EventsNetworkError extends DomainError {
  readonly code = 'EVENTS/NETWORK';
}

export class EventsBadResponseError extends BadResponseError {
  readonly code = 'EVENTS/BAD_RESPONSE';
}

// `resolveIncident` throws a plain Error when there is no incident for the
// event, so the API answers 500 instead of 404 (EventIncidentService.ts:28).
export class IncidentNotFoundError extends DomainError {
  readonly code = 'EVENTS/INCIDENT_NOT_FOUND';
}

export class UnknownEventsError extends DomainError {
  readonly code = 'EVENTS/UNKNOWN';
}
