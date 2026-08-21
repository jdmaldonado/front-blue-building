import { z } from 'zod';
import { IdSchema } from '../shared';
import { EventOriginSchema, IncidentStatusSchema, MonitorLensSchema } from './events.constants';

// These endpoints answer flat objects, unlike the rest of the API, which wraps
// each row in `{ user: ... }` or `{ card: ... }`. Third convention in the same
// backend, so it is written down here and not discovered again.

// Numbers arrive as strings on the open-door endpoint: `page` and `limit` come
// straight from the query string with no `Number()` on the way out.
const CountSchema = z.union([z.string(), z.number()]).transform(Number);

// Same split as residents and cards: what identifies the row stays strict, the
// rest degrades so one odd record costs that record and not the screen.
export const CriticalEventSchema = z.object({
  id: IdSchema,
  type: z.string(),

  origin: EventOriginSchema.nullish().catch(null),
  createdAt: z.string().nullish().catch(null),
  door: z.string().nullish().catch(null),
  // Added later than `door`: an API that has not been updated sends only the
  // name, so this can be missing.
  doorId: IdSchema.nullish().catch(null),
  buildingId: IdSchema.nullish().catch(null),
  buildingName: z.string().nullish().catch(null),
  userName: z.string().nullish().catch(null),
  userPhone: z.string().nullish().catch(null),
  apartment: z.string().nullish().catch(null),

  // The incident, flattened into the same row by the API.
  incidentId: IdSchema.nullish().catch(null),
  status: IncidentStatusSchema.nullish().catch(null),
  supportUserName: z.string().nullish().catch(null),
  supportReason: z.string().nullish().catch(null),
  solutionComment: z.string().nullish().catch(null),
  incidentUpdatedAt: z.string().nullish().catch(null),
});
export type CriticalEvent = z.infer<typeof CriticalEventSchema>;

// A row here is not one event: it is every photo of the same episode, grouped
// by camera and motion sequence.
//
// The grouping has no ceiling, and when `intrusionMotionSequenceId` is missing
// every capture of a camera lands in the same row
// (api/src/2.0/cameras/controller/EventIntrusionController.ts:15). Keeping all
// of them alive in the query cache is what makes the screen stop responding, so
// the row keeps a page worth of photos and remembers how many there were.
const MAX_SEQUENCE_URLS = 60;

export const IntrusionEventSchema = z
  .object({
    id: IdSchema,

    cameraId: IdSchema.nullish().catch(null),
    cameraName: z.string().nullish().catch(null),
    buildingId: IdSchema.nullish().catch(null),
    buildingName: z.string().nullish().catch(null),
    eventType: z.string().nullish().catch(null),
    intrusionSequenceId: z.union([z.string(), z.number()]).nullish().catch(null),
    imageUrls: z.array(z.string()).catch([]),
    startTime: z.string().nullish().catch(null),
    endTime: z.string().nullish().catch(null),
  })
  .transform((row) => ({
    ...row,
    imageUrls: row.imageUrls.length > MAX_SEQUENCE_URLS ? row.imageUrls.slice(0, MAX_SEQUENCE_URLS) : row.imageUrls,
    imageCount: row.imageUrls.length,
  }));
export type IntrusionEvent = z.infer<typeof IntrusionEventSchema>;

// Half of this row comes in snake_case and half in camelCase: the DTO mixes both
// (api/src/2.0/cameras/dtos/EventOpenDoor.dto.ts). Reading only camelCase left
// the photo and both timestamps empty on every row, quietly, because each field
// falls back to null on its own.
export const OpenDoorEventSchema = z
  .object({
    // Null when the capture failed: the API still returns the row.
    id: IdSchema.nullish().catch(null),

    image_url: z.string().nullish().catch(null),
    people_detected: z.number().nullish().catch(null),
    timestamp_camera: z.string().nullish().catch(null),
    timestamp_event: z.string().nullish().catch(null),
    created_at: z.string().nullish().catch(null),

    eventType: z.string().nullish().catch(null),
    // The same value under two names: the API renamed it to `origin` for the old
    // panel and then put `eventOrigin` back, so today it sends both
    // (api/src/2.0/cameras/controller/EventOpenDoorController.ts:20-21). We read
    // whichever arrives.
    eventOrigin: EventOriginSchema.nullish().catch(null),
    origin: EventOriginSchema.nullish().catch(null),
    doorName: z.string().nullish().catch(null),
    userName: z.string().nullish().catch(null),
    apartment: z.string().nullish().catch(null),
    buildingId: IdSchema.nullish().catch(null),
    buildingName: z.string().nullish().catch(null),
  })
  .transform((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    peopleDetected: row.people_detected,
    timestampCamera: row.timestamp_camera,
    timestampEvent: row.timestamp_event,
    createdAt: row.created_at,
    eventType: row.eventType,
    eventOrigin: row.eventOrigin ?? row.origin,
    doorName: row.doorName,
    userName: row.userName,
    apartment: row.apartment,
    buildingId: row.buildingId,
    buildingName: row.buildingName,
  }));
export type OpenDoorEvent = z.infer<typeof OpenDoorEventSchema>;

// The envelope both paged endpoints share. The rows come as `unknown` so each
// one can be read on its own.
export const PagedEventsResponseSchema = z.object({
  page: CountSchema.catch(1),
  limit: CountSchema.catch(0),
  totalRecords: CountSchema.catch(0),
  totalPages: CountSchema.catch(1),
});

export interface EventPage<TItem> {
  items: TItem[];
  // Rows the API actually sent, before we cut the list down to one page. More
  // than `limit` means the endpoint ignored it.
  received: number;
  page: number;
  totalPages: number;
  totalRecords: number;
  // Rows the API sent that we could not read.
  skipped: number;
}

export interface CriticalEventList {
  events: CriticalEvent[];
  skipped: number;
}

// TODO: drop `supportUserId` and `supportUserName`. The API already takes the
// person from the token and ignores both
// (api/src/2.0/events/controllers/EventController.ts:32-33), but an environment
// running an older build still rejects the request without them, so they keep
// travelling until every one is updated.
export const StartIncidentInputSchema = z.object({
  eventId: IdSchema,
  supportUserId: IdSchema,
  supportUserName: z.string().min(1),
  supportReason: z.string().min(1),
});
export type StartIncidentInput = z.infer<typeof StartIncidentInputSchema>;

export const ResolveIncidentInputSchema = z.object({
  eventId: IdSchema,
  solutionComment: z.string().trim().min(1, 'Cuenta qué se hizo para resolverlo.'),
});
export type ResolveIncidentInput = z.infer<typeof ResolveIncidentInputSchema>;

// What the monitor can be opened with. All optional: the screen falls back to
// the critical lens over every building.
export const MonitorSearchSchema = z.object({
  lens: MonitorLensSchema.optional(),
  buildingId: z.string().optional(),
  page: z.number().optional(),
});
export type MonitorSearch = z.infer<typeof MonitorSearchSchema>;
