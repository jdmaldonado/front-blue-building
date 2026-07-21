import { z } from 'zod';
import { IdSchema } from '../shared';

export const BuildingSchema = z.object({
  id: IdSchema,
  name: z.string(),
});
export type Building = z.infer<typeof BuildingSchema>;

export const ApartmentSchema = z.object({
  id: IdSchema,
  name: z.string().nullish(),
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
