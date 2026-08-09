export const EventsPath = {
  Critical: '/api/bluebuilding/events/critical/recent',
  Intrusions: '/api/bluebuilding/events/event-intrusion',
  OpenDoor: '/api/bluebuilding/events/open-door',
  IncidentStart: '/api/bluebuilding/event-incident/start',
  IncidentResolve: '/api/bluebuilding/event-incident/resolve',
} as const;

export interface EventPageInput {
  buildingId?: string | null;
  page: number;
  limit: number;
}

export function eventsPagePath(path: string, input: EventPageInput): string {
  const query = new URLSearchParams({ page: String(input.page), limit: String(input.limit) });
  if (input.buildingId !== null && input.buildingId !== undefined && input.buildingId !== '') {
    query.set('buildingId', input.buildingId);
  }
  return `${path}?${query.toString()}`;
}
