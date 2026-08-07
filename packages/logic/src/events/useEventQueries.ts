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

// `keepPreviousData` on purpose: paging through a monitor should not blank the
// table on every step.
export function useIntrusionEvents(input: EventPageQuery): UseQueryResult<EventPage<IntrusionEvent>> {
  const { eventsGateway } = useServices();

  return useQuery({
    queryKey: eventKeys.intrusions(input.buildingId ?? '', input.page),
    queryFn: () => eventsGateway.listIntrusions(input),
    placeholderData: (previous) => previous,
  });
}

export function useOpenDoorEvents(input: EventPageQuery): UseQueryResult<EventPage<OpenDoorEvent>> {
  const { eventsGateway } = useServices();

  return useQuery({
    queryKey: eventKeys.openDoor(input.buildingId ?? '', input.page),
    queryFn: () => eventsGateway.listOpenDoorEvents(input),
    placeholderData: (previous) => previous,
  });
}
