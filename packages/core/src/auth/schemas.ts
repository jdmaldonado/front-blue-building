import { z } from 'zod';
import { ApartmentSchema, BuildingSchema } from '../buildings';
import { IdSchema } from '../shared';
import { LoginMode, PASSWORD_MIN_LENGTH, RoleType, UserType } from './constants';

export const UserTypeSchema = z.enum(UserType);
export const RoleTypeSchema = z.enum(RoleType);
export const LoginModeSchema = z.enum(LoginMode);

// The resident login does NOT send userType (user_login_dto.ts:39-45).
export const UserSchema = z.object({
  id: IdSchema,
  cedula: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
});
export type User = z.infer<typeof UserSchema>;

// The super admin login sends userType but no phone (bb_support_login_dto.ts:5-13).
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

// Lives here so web and native validate the same way. Messages are for users,
// so they are in Spanish.
export const LoginInputSchema = z.object({
  cedula: z.string().trim().min(1, 'Ingresa tu documento.'),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
  mode: LoginModeSchema,
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

// Only residents can recover a password: the API filters by userType = USER
// (api/src/controllers/users/auth/controller.ts:100-107).
export const ForgotPasswordInputSchema = z.object({
  cedula: z.string().trim().min(1, 'Ingresa tu documento.'),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;

export const ResetPasswordInputSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;

// The confirm field stays in the form, it never goes to the API.
export const ResetPasswordFormSchema = ResetPasswordInputSchema.extend({
  passwordConfirm: z.string(),
}).refine((form) => form.password === form.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Las contraseñas no coinciden.',
});
export type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;

// The two login endpoints answer differently: only the resident one has spaces.
export const UserLoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
  spaces: z.array(SpaceSchema),
});

export const AdminLoginResponseSchema = z.object({
  token: z.string(),
  user: AdminUserSchema,
});

// Discriminated by mode, so `spaces` only exists where it makes sense.
export type Session =
  | { mode: typeof LoginMode.Usuario; token: string; user: User; spaces: Space[] }
  | { mode: typeof LoginMode.Admin; token: string; user: AdminUser };
