import { z } from 'zod';
import { RoleTypeSchema } from '../auth';
import { IdSchema } from '../shared';

export const CardTagSchema = z.object({
  tag: z.string(),
  type: z.string().nullish(),
  active: z.boolean().nullish(),
});
export type CardTag = z.infer<typeof CardTagSchema>;

// Flat shape the admin list needs. The API nests it inside `{ user: ... }`
// (api/src/2.0/users/dtos/userDetails.dto.ts:17), and the gateway unwraps it.
export const ResidentDetailsSchema = z.object({
  id: IdSchema,
  documentType: z.string().nullish(),
  cedula: z.string(),
  name: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  active: z.boolean().nullish(),
  verified: z.boolean().nullish(),
  photo: z.string().nullish(),
  tags: z.array(CardTagSchema).default([]),
  roleName: RoleTypeSchema.nullish(),
  // Names only: the DTO carries no apartment or building id.
  apartmentName: z.string().nullish(),
  buildingName: z.string().nullish(),
});
export type ResidentDetails = z.infer<typeof ResidentDetailsSchema>;

export const ResidentDetailsResponseSchema = z.array(z.object({ user: ResidentDetailsSchema }));

export const UpdateResidentInputSchema = z.object({
  userId: IdSchema,
  phone: z.string().trim().min(1, 'Ingresa un teléfono.'),
});
export type UpdateResidentInput = z.infer<typeof UpdateResidentInputSchema>;

// The flag decides if the cards follow the user. Deactivating a user blocks the
// physical card read, never the app (docs 03-panel-admin/usuarios.md).
export const SetResidentActiveInputSchema = z.object({
  userId: IdSchema,
  active: z.boolean(),
  withCards: z.boolean(),
});
export type SetResidentActiveInput = z.infer<typeof SetResidentActiveInputSchema>;
