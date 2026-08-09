import type { ApprovalScope } from '@bb/core';

export const accessRequestKeys = {
  all: ['access-requests'] as const,
  list: (scope: ApprovalScope, spaceId: string) => [...accessRequestKeys.all, scope, spaceId] as const,
};
