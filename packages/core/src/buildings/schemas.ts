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
});
export type Building = z.infer<typeof BuildingSchema>;

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
