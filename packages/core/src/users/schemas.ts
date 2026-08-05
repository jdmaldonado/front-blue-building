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
//
// Two halves on purpose. The first three fields identify the person and are the
// ones every action needs: without them the row cannot be drawn, because nobody
// should deactivate a user they cannot name. Everything else degrades to null
// instead of taking the whole list down, so one odd record costs one field and
// not the screen.
export const ResidentDetailsSchema = z.object({
  id: IdSchema,
  cedula: z.string(),
  name: z.string(),

  documentType: z.string().nullish().catch(null),
  phone: z.string().nullish().catch(null),
  email: z.string().nullish().catch(null),
  active: z.boolean().nullish().catch(null),
  verified: z.boolean().nullish().catch(null),
  photo: z.string().nullish().catch(null),
  tags: z.array(CardTagSchema).catch([]),
  // A role we do not know yet is not a reason to hide the user.
  roleName: RoleTypeSchema.nullish().catch(null),
  // Names only: the DTO carries no apartment or building id.
  apartmentName: z.string().nullish().catch(null),
  buildingName: z.string().nullish().catch(null),
});
export type ResidentDetails = z.infer<typeof ResidentDetailsSchema>;

export const ResidentDetailsEntrySchema = z.object({ user: ResidentDetailsSchema });

// What the list looks like before reading each entry: only "it is a list".
export const ResidentDetailsResponseSchema = z.array(z.unknown());

// `skipped` counts the records that could not be identified. The screen says how
// many were lost instead of pretending the list is complete.
export type ResidentList = {
  residents: ResidentDetails[];
  skipped: number;
};

// What `GET /users/:cedula` answers, wrapped in `{ user }`. `verified` is the
// gate: without it the API refuses to create cards for this person.
export const UserAccountSchema = z.object({
  id: IdSchema,
  cedula: z.string(),
  name: z.string(),

  verified: z.boolean().nullish().catch(null),
  active: z.boolean().nullish().catch(null),
  photo: z.string().nullish().catch(null),
  phone: z.string().nullish().catch(null),
  email: z.string().nullish().catch(null),
});
export type UserAccount = z.infer<typeof UserAccountSchema>;

export const UserAccountResponseSchema = z.object({ user: UserAccountSchema });

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
