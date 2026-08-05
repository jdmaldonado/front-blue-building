import { z } from 'zod';
import { TowerSchema } from '../buildings';
import { ReaderStateSchema } from '../readers/schemas';
import { IdSchema } from '../shared';
import { DoorType } from './constants';

export const DoorTypeSchema = z.enum(DoorType);

export const DoorCameraSchema = z.object({
  id: IdSchema,
  name: z.string().nullish(),
});
export type DoorCamera = z.infer<typeof DoorCameraSchema>;

// ListDoorsDTO. `left` and `top` are percentages over the floor plan image.
export const DoorSchema = z.object({
  id: IdSchema,
  localId: z.string().nullish(),
  name: z.string().nullish(),
  doorType: DoorTypeSchema,
  left: z.number().nullish(),
  top: z.number().nullish(),
  cameras: z.array(DoorCameraSchema).default([]),
  tower: TowerSchema.nullish(),
  floor: z.object({ id: IdSchema, name: z.string().nullish() }).nullish(),
});
export type Door = z.infer<typeof DoorSchema>;

// `eventType` is a plain string: an unknown type must not break the stream.
//
// The same event now also carries reader telemetry (api/src/hardware/handlers/
// handleTelemetryNotify.ts), so the extra fields live here. All optional: a
// plain door event carries none of them.
export const DoorEventDataSchema = z.object({
  eventType: z.string(),
  lastEventTimestamp: z.union([z.string(), z.number()]).nullish(),
  initiatedByUserId: IdSchema.nullish(),

  masterStatus: z.string().nullish().catch(null),
  slaveStatus: z.string().nullish().catch(null),
  masterSpiOk: z.boolean().nullish().catch(null),
  slaveSpiOk: z.boolean().nullish().catch(null),
  deviceType: z.string().nullish().catch(null),
  lastTelemetryTimestamp: z.number().nullish().catch(null),
  // The nested part: wifi, device id, firmware and hardware versions. It is the
  // only way to read anything the reader currently has.
  readerState: ReaderStateSchema.nullish().catch(null),
});
export type DoorEventData = z.infer<typeof DoorEventDataSchema>;

export const DoorUpdateSchema = z.object({
  buildingId: IdSchema.nullish(),
  doorId: IdSchema,
  // Telemetry frames also carry it, and it is what identifies the reader.
  localId: z.union([z.string(), z.number()]).nullish(),
  event: DoorEventDataSchema,
});
export type DoorUpdate = z.infer<typeof DoorUpdateSchema>;

// Live state by door id. A door with no entry has no reported state.
export const DoorStatusesSchema = z.record(z.string(), DoorEventDataSchema);
export type DoorStatuses = z.infer<typeof DoorStatusesSchema>;
