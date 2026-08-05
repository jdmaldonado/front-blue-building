import type { UserAccount } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { userKeys } from './keys';

// The card screen starts here. `verified` decides what it can offer next.
export function useUserByDocument(document: string | null): UseQueryResult<UserAccount> {
  const { usersGateway } = useServices();

  return useQuery({
    queryKey: userKeys.byDocument(document ?? ''),
    queryFn: () => usersGateway.getByDocument(document ?? ''),
    enabled: document !== null && document !== '',
    // A missing user is an answer, not a failure worth insisting on.
    retry: false,
  });
}
