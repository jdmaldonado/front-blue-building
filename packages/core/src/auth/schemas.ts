import { z } from 'zod';
import { ApartmentSchema, BuildingSchema } from '../buildings';
import { IdSchema } from '../shared';
import { LoginMode, RoleType, UserType } from './constants';

export const UserTypeSchema = z.enum(UserType);
export const RoleTypeSchema = z.enum(RoleType);
export const LoginModeSchema = z.enum(LoginMode);

export const UserSchema = z.object({
  id: IdSchema,
  cedula: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  userType: UserTypeSchema,
});
export type User = z.infer<typeof UserSchema>;

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

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
  spaces: z.array(SpaceSchema),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
