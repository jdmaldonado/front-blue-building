import {
  CriticalEventSchema,
  IntrusionEventSchema,
  OpenDoorEventSchema,
  PagedEventsResponseSchema,
  type CriticalEventList,
  type EventPage,
  type IntrusionEvent,
  type OpenDoorEvent,
  type ResolveIncidentInput,
  type StartIncidentInput,
} from '@bb/core';
import type { Logger } from '@bb/logger';
import { z } from 'zod';
import type { HttpClient } from '../http';
import { readRows } from '../shared';
import { toEventsError } from './events.errors';
import { EventsPath, eventsPagePath, type EventPageInput } from './events.paths';

export class EventsGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  // Fifteen most recent, no paging and no filters: the API decides what counts
  // as critical with a fixed blacklist (api/.../EventService.ts:15-17).
  async listCriticalEvents(): Promise<CriticalEventList> {
    try {
      const raw = await this.http.get({ path: EventsPath.Critical });
      const rows = z.array(z.unknown()).parse(raw);
      const { items, skipped } = readRows(rows, CriticalEventSchema, {
        logger: this.logger,
        path: EventsPath.Critical,
        label: 'Event',
      });
      return { events: items, skipped };
    } catch (error) {
      throw toEventsError(error);
    }
  }

  async listIntrusions(input: EventPageInput): Promise<EventPage<IntrusionEvent>> {
    return this.readPage(EventsPath.Intrusions, 'eventIntrusionDetails', IntrusionEventSchema, input);
  }

  async listOpenDoorEvents(input: EventPageInput): Promise<EventPage<OpenDoorEvent>> {
    return this.readPage(EventsPath.OpenDoor, 'eventOpenDoorDetails', OpenDoorEventSchema, input);
  }

  async startIncident(input: StartIncidentInput): Promise<void> {
    try {
      await this.http.put({ path: EventsPath.IncidentStart, body: input });
    } catch (error) {
      throw toEventsError(error);
    }
  }

  async resolveIncident(input: ResolveIncidentInput): Promise<void> {
    try {
      await this.http.put({ path: EventsPath.IncidentResolve, body: input });
    } catch (error) {
      throw toEventsError(error);
    }
  }

  private async readPage<TItem>(
    basePath: string,
    key: string,
    schema: z.ZodType<TItem>,
    input: EventPageInput,
  ): Promise<EventPage<TItem>> {
    const path = eventsPagePath(basePath, input);

    try {
      const raw = await this.http.get({ path });
      const envelope = PagedEventsResponseSchema.parse(raw);
      const all = z.object({ [key]: z.array(z.unknown()).catch([]) }).parse(raw)[key] as unknown[];

      // Never render more than a page worth of rows, whatever the API sends. A
      // list of tens of thousands of rows freezes the tab on the next render,
      // and the screen cannot page through what it never asked for.
      const rows = all.length > input.limit ? all.slice(0, input.limit) : all;
      if (all.length > input.limit) {
        this.logger.warn('Paged endpoint ignored its limit', { path, limit: input.limit, received: all.length });
      }

      const { items, skipped } = readRows(rows, schema, { logger: this.logger, path, label: 'Event' });

      return {
        items,
        received: all.length,
        page: envelope.page,
        totalPages: envelope.totalPages,
        totalRecords: envelope.totalRecords,
        skipped,
      };
    } catch (error) {
      throw toEventsError(error);
    }
  }
}
