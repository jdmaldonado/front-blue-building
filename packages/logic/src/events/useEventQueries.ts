import type { CriticalEventList, EventPage, IntrusionEvent, OpenDoorEvent } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { eventKeys } from './keys';

// The API decides what counts as critical and returns the last fifteen. No
// paging, no filters.
export function useCriticalEvents(): UseQueryResult<CriticalEventList> {
  const { eventsGateway } = useServices();

  return useQuery({
    queryKey: eventKeys.critical(),
    queryFn: () => eventsGateway.listCriticalEvents(),
  });
}

export interface EventPageQuery {
  buildingId: string | null;
  page: number;
  limit: number;
}

// These two lists are expensive on the server: intrusions loads its whole table
// and open doors counts millions of rows. Refetching them every time the window
// regains focus meant a click could relaunch both at once. The screen has an
// explicit refresh button, so freshness stays in the reader's hands.
const EXPENSIVE_LIST_OPTIONS = {
  refetchOnWindowFocus: false,
  staleTime: 60_000,
} as const;

// `keepPreviousData` on purpose: paging through a monitor should not blank the
// table on every step.
export function useIntrusionEvents(input: EventPageQuery): UseQueryResult<EventPage<IntrusionEvent>> {
  const { eventsGateway } = useServices();

  return useQuery({
    queryKey: eventKeys.intrusions(input.buildingId ?? '', input.page),
    queryFn: () => eventsGateway.listIntrusions(input),
    placeholderData: (previous) => previous,
    ...EXPENSIVE_LIST_OPTIONS,
  });
}

export function useOpenDoorEvents(input: EventPageQuery): UseQueryResult<EventPage<OpenDoorEvent>> {
  const { eventsGateway } = useServices();

  return useQuery({
    queryKey: eventKeys.openDoor(input.buildingId ?? '', input.page),
    queryFn: () => eventsGateway.listOpenDoorEvents(input),
    placeholderData: (previous) => previous,
    ...EXPENSIVE_LIST_OPTIONS,
  });
}
