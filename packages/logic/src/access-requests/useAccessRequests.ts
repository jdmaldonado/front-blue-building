import type { AccessRequestList, ApprovalScope } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { accessRequestKeys } from './access-requests.keys';

// Null while the caller still does not know where it is approving.
export function useAccessRequests(
  scope: ApprovalScope | null,
  spaceId: string | null,
): UseQueryResult<AccessRequestList> {
  const { accessRequestsGateway } = useServices();

  return useQuery({
    queryKey: accessRequestKeys.list(scope ?? ('' as ApprovalScope), spaceId ?? ''),
    queryFn: () => {
      if (scope === null || spaceId === null) {
        throw new Error('scope and spaceId are required');
      }
      return accessRequestsGateway.list(scope, spaceId);
    },
    enabled: scope !== null && spaceId !== null,
  });
}
