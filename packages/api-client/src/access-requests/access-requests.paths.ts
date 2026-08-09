import { ApprovalScope } from '@bb/core';

// The building list ignores this id and filters only by the logged-in user
// (api/src/controllers/buildings/access/controller.ts:107-110). It still has to
// be a building this person administers: the middleware checks that part.
function scopePath(scope: ApprovalScope, spaceId: string): string {
  switch (scope) {
    case ApprovalScope.Apartment:
      return `/api/apartments/${spaceId}/access`;
    case ApprovalScope.Building:
      return `/api/buildings/${spaceId}/access`;
  }
}

export function accessRequestsPath(scope: ApprovalScope, spaceId: string): string {
  return scopePath(scope, spaceId);
}

export function resolveAccessRequestPath(scope: ApprovalScope, spaceId: string, requestId: string): string {
  return `${scopePath(scope, spaceId)}/${requestId}`;
}
