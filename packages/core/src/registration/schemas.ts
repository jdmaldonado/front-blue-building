import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../auth';
import { IdSchema } from '../shared';
import { DocumentTypeSchema, PHONE_DIGITS } from './constants';

// The person filling the form. Limits mirror what the API validates
// (api/src/controllers/apartments/users/register_apartment_user_form.ts:5-31),
// so a form that passes here is not rejected on the server for length.
//
// The photo is not here: it is a `File` and this package has no DOM types. It
// travels in the gateway input, next to these fields.
export const RegistrationDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa tu nombre completo.'),
  cedula: z
    .string()
    .trim()
    .min(4, 'El documento debe tener al menos 4 caracteres.')
    .max(50, 'El documento no puede pasar de 50 caracteres.'),
  documentType: DocumentTypeSchema,
  email: z.string().trim().toLowerCase().pipe(z.email('Escribe un correo válido.')),
  // Only the digits: the country prefix is added when the request is built.
  phone: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${PHONE_DIGITS}}$`), `El teléfono son ${PHONE_DIGITS} dígitos, sin espacios.`),
  password: z.string().min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
});
export type RegistrationDetails = z.infer<typeof RegistrationDetailsSchema>;

// What the form validates on submit. `passwordConfirm` and `acceptTerms` never
// reach the API: the server ignores the confirmation
// (register_apartment_user_form.ts:12, saved but never compared) and knows
// nothing about the terms, so both checks are ours to make.
export const RegistrationFormSchema = RegistrationDetailsSchema.extend({
  passwordConfirm: z.string(),
  acceptTerms: z.literal(true, 'Debes aceptar los términos y condiciones.'),
}).refine((form) => form.password === form.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Las contraseñas no coinciden.',
});
export type RegistrationForm = z.infer<typeof RegistrationFormSchema>;

// Where the person is registering. The picker walks building -> tower -> floor
// -> apartment, but only the apartment reaches the API: the other three are
// there to find it.
export const ApartmentLocationSchema = z.object({
  buildingId: IdSchema,
  towerId: IdSchema,
  floorId: IdSchema,
  apartmentId: IdSchema,
});
export type ApartmentLocation = z.infer<typeof ApartmentLocationSchema>;

// What the screen can be opened with. `apartmentId` skips the picker, so a
// resident can share a link with their apartment already chosen.
export const RegistrationSearchSchema = z.object({
  apartmentId: z.string().optional(),
});
export type RegistrationSearch = z.infer<typeof RegistrationSearchSchema>;
