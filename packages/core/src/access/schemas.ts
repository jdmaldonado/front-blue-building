import { z } from 'zod';
import { TowerSchema } from '../buildings';
import { IdSchema } from '../shared';
import { DoorType } from './constants';

export const DoorTypeSchema = z.enum(DoorType);

export const DoorSchema = z.object({
  id: IdSchema,
  localId: z.string().nullish(),
  doorType: DoorTypeSchema,
  name: z.string().nullish(),
  state: z.string().nullish(),
  cameraId: IdSchema.nullish(),
  left: z.number().nullish(),
  top: z.number().nullish(),
  floor: z.object({ id: IdSchema }).nullish(),
  tower: TowerSchema.nullish(),
});
export type Door = z.infer<typeof DoorSchema>;

export const DoorEventDataSchema = z.object({
  eventType: z.string(),
  lastEventTimestamp: z.union([z.string(), z.number()]).nullish(),
  initiatedByUserId: IdSchema.nullish(),
});
export type DoorEventData = z.infer<typeof DoorEventDataSchema>;

export const DoorUpdateSchema = z.object({
  buildingId: IdSchema.nullish(),
  doorId: IdSchema,
  event: DoorEventDataSchema,
});
export type DoorUpdate = z.infer<typeof DoorUpdateSchema>;

export const DoorStatusSchema = z.object({
  eventType: z.string(),
});
export type DoorStatus = z.infer<typeof DoorStatusSchema>;

// The API returns door statuses keyed by door id.
export const DoorStatusesSchema = z.record(z.string(), DoorStatusSchema);
export type DoorStatuses = z.infer<typeof DoorStatusesSchema>;
