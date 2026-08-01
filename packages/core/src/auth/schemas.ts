import { z } from 'zod';
import { ApartmentSchema, BuildingSchema } from '../buildings';
import { IdSchema } from '../shared';
import { LoginMode, RoleType, UserType } from './constants';

export const UserTypeSchema = z.enum(UserType);
export const RoleTypeSchema = z.enum(RoleType);
export const LoginModeSchema = z.enum(LoginMode);

// The resident login DTO does NOT send userType
// (api/src/controllers/users/auth/user_login_dto.ts:39-45).
export const UserSchema = z.object({
  id: IdSchema,
  cedula: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
});
export type User = z.infer<typeof UserSchema>;

// The super admin DTO sends userType but no phone
// (api/src/controllers/bluebuilding/auth/bb_support_login_dto.ts:5-13).
export const AdminUserSchema = UserSchema.extend({
  userType: UserTypeSchema,
});
export type AdminUser = z.infer<typeof AdminUserSchema>;

export const SpaceSchema = z.object({
  role: z.object({ name: RoleTypeSchema }),
  building: BuildingSchema,
  apartment: ApartmentSchema.nullish(),
});
export type Space = z.infer<typeof SpaceSchema>;

// Input contract of the login form. Lives here so the web and the future native
// app validate with the same rules; messages are user-facing, hence Spanish.
export const LoginInputSchema = z.object({
  cedula: z.string().trim().min(1, 'Ingresa tu documento.'),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
  mode: LoginModeSchema,
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

// Wire shapes: the two login endpoints answer differently. Resident login brings
// the spaces; super admin login brings none (it picks a building later).
export const UserLoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
  spaces: z.array(SpaceSchema),
});

export const AdminLoginResponseSchema = z.object({
  token: z.string(),
  user: AdminUserSchema,
});

// Domain shape: what the app carries after logging in. Discriminated by mode, so
// `spaces` only exists where it makes sense.
export type Session =
  | { mode: typeof LoginMode.Usuario; token: string; user: User; spaces: Space[] }
  | { mode: typeof LoginMode.Admin; token: string; user: AdminUser };
