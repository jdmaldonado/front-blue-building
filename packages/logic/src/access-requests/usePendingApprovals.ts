import type { ApprovalPlace } from '@bb/core';
import { useQueries } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { accessRequestKeys } from './access-requests.keys';

// How many requests are waiting across every place this person approves.
// Usually one place, sometimes two: the leader of an apartment who also
// administers the building.
//
// Same keys as `useAccessRequests`, so opening the screen costs no extra
// request and answering one updates the count.
export function usePendingApprovals(places: readonly ApprovalPlace[]): number {
  const { accessRequestsGateway } = useServices();

  return useQueries({
    queries: places.map((place) => ({
      queryKey: accessRequestKeys.list(place.scope, place.spaceId),
      queryFn: () => accessRequestsGateway.list(place.scope, place.spaceId),
    })),
    combine: (results) => results.reduce((total, result) => total + (result.data?.requests.length ?? 0), 0),
  });
}
