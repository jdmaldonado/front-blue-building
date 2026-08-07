import { z } from 'zod';
import { IdSchema } from '../shared';
import { EventOriginSchema, IncidentStatusSchema, MonitorLensSchema } from './constants';

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
export const IntrusionEventSchema = z.object({
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
});
export type IntrusionEvent = z.infer<typeof IntrusionEventSchema>;

export const OpenDoorEventSchema = z.object({
  // Null when the capture failed: the API still returns the row.
  id: IdSchema.nullish().catch(null),

  imageUrl: z.string().nullish().catch(null),
  peopleDetected: z.number().nullish().catch(null),
  timestampCamera: z.string().nullish().catch(null),
  timestampEvent: z.string().nullish().catch(null),
  createdAt: z.string().nullish().catch(null),
  eventType: z.string().nullish().catch(null),
  eventOrigin: EventOriginSchema.nullish().catch(null),
  doorName: z.string().nullish().catch(null),
  userName: z.string().nullish().catch(null),
  apartment: z.string().nullish().catch(null),
  buildingId: IdSchema.nullish().catch(null),
  buildingName: z.string().nullish().catch(null),
});
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
