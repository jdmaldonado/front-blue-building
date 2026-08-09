import type { CardList } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { cardKeys } from './cards.keys';

// Cards belong to a person, and the API looks them up by document.
export function useCards(document: string | null): UseQueryResult<CardList> {
  const { cardsGateway } = useServices();

  return useQuery({
    queryKey: cardKeys.byDocument(document ?? ''),
    queryFn: () => cardsGateway.listByDocument(document ?? ''),
    enabled: document !== null && document !== '',
  });
}
