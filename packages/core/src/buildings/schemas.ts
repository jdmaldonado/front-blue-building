import { z } from 'zod';
import { IdSchema } from '../shared';
import { ApartmentType, BuildingType } from './constants';

export const BuildingTypeSchema = z.enum(BuildingType);
export const ApartmentTypeSchema = z.enum(ApartmentType);

// Shape sent by the login DTO (api/src/controllers/users/auth/user_login_dto.ts:25-34).
// Everything past id/name is optional here: other endpoints return a slimmer building.
export const BuildingSchema = z.object({
  id: IdSchema,
  name: z.string(),
  type: BuildingTypeSchema.nullish(),
  address1: z.string().nullish(),
  address2: z.string().nullish(),
  contacts: z.array(z.string()).nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  // Only the admin list carries it. While this date is in the future the API
  // sends no SMS or calls for the building
  // (api/src/2.0/events/services/EventNotification.service.ts:26-29).
  maintenanceModeEndsAt: z.coerce.date().nullish(),
});
export type Building = z.infer<typeof BuildingSchema>;

export function isBuildingInMaintenance(building: Building, now: Date = new Date()): boolean {
  const endsAt = building.maintenanceModeEndsAt;
  return endsAt !== null && endsAt !== undefined && endsAt.getTime() > now.getTime();
}

// The API only checks that it is a number (BuildingControllerV2.ts:20). The
// limits are ours, so nobody mutes a building for a year by mistake.
export const MAINTENANCE_MIN_MINUTES = 5;
export const MAINTENANCE_MAX_MINUTES = 24 * 60;

export const MaintenanceInputSchema = z.object({
  buildingId: IdSchema,
  durationMinutes: z
    .number()
    .int()
    .min(MAINTENANCE_MIN_MINUTES, `El mínimo es ${MAINTENANCE_MIN_MINUTES} minutos.`)
    .max(MAINTENANCE_MAX_MINUTES, 'El máximo es 24 horas.'),
});
export type MaintenanceInput = z.infer<typeof MaintenanceInputSchema>;

export const ApartmentSchema = z.object({
  id: IdSchema,
  name: z.string().nullish(),
  address: z.string().nullish(),
  apartmentType: ApartmentTypeSchema.nullish(),
});
export type Apartment = z.infer<typeof ApartmentSchema>;

export const TowerSchema = z.object({
  id: IdSchema,
  name: z.string().nullish(),
});
export type Tower = z.infer<typeof TowerSchema>;

export const FloorSchema = z.object({
  id: IdSchema,
  name: z.string().nullish(),
  image: z.string().nullish(),
});
export type Floor = z.infer<typeof FloorSchema>;
