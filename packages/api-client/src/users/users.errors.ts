import { UnknownUsersError, UserNotFoundError, UsersBadResponseError, UsersNetworkError } from '@bb/core';
import { createErrorMapper, HttpStatus } from '../shared';

const rules = {
  network: (cause: unknown) => new UsersNetworkError('Network error while reading users', { cause }),
  badResponse: (cause: unknown) => new UsersBadResponseError('The users answer has an unexpected shape', { cause }),
  unknown: (cause: unknown) => new UnknownUsersError('Unexpected error while reading users', { cause }),
};

export const toUsersError = createErrorMapper(rules);

// Only where a document was asked for: there, a 404 names the person, not the
// endpoint. On the lists it would mean something else entirely.
export const toUserLookupError = createErrorMapper({
  ...rules,
  byStatus: {
    [HttpStatus.NotFound]: (error) => new UserNotFoundError('No user with that document', { cause: error }),
  },
});
