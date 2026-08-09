import { EventsBadResponseError, EventsNetworkError, IncidentNotFoundError, UnknownEventsError } from '@bb/core';
import { createErrorMapper, HttpStatus } from '../shared';

export const toEventsError = createErrorMapper({
  network: (cause) => new EventsNetworkError('Network error while reading events', { cause }),
  badResponse: (cause) => new EventsBadResponseError('The events answer has an unexpected shape', { cause }),
  unknown: (cause) => new UnknownEventsError('Unexpected error while reading events', { cause }),
  byStatus: {
    [HttpStatus.NotFound]: (error) =>
      new IncidentNotFoundError('There is no incident for that event', { cause: error }),
  },
});
