import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../auth';
import { DocumentTypeSchema, PHONE_DIGITS } from './registration.constants';

// Limits mirror what the API validates
// (api/src/controllers/apartments/users/register_apartment_user_form.ts:5-31).
// The photo is missing on purpose: it is a `File` and this package has no DOM
// types, so it travels in the gateway input.
export const RegistrationDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa tu nombre completo.'),
  cedula: z
    .string()
    .trim()
    .min(4, 'El documento debe tener al menos 4 caracteres.')
    .max(50, 'El documento no puede pasar de 50 caracteres.'),
  documentType: DocumentTypeSchema,
  email: z.string().trim().toLowerCase().pipe(z.email('Escribe un correo válido.')),
  // Digits only: the country prefix is added when the request is built.
  phone: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${PHONE_DIGITS}}$`), `El teléfono son ${PHONE_DIGITS} dígitos, sin espacios.`),
  password: z.string().min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`),
});
export type RegistrationDetails = z.infer<typeof RegistrationDetailsSchema>;

// The API saves `passwordConfirmation` without ever comparing it
// (register_apartment_user_form.ts:12) and knows nothing about the terms, so
// both checks are ours.
export const RegistrationFormSchema = RegistrationDetailsSchema.extend({
  passwordConfirm: z.string(),
  acceptTerms: z.literal(true, 'Debes aceptar los términos y condiciones.'),
}).refine((form) => form.password === form.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Las contraseñas no coinciden.',
});
export type RegistrationForm = z.infer<typeof RegistrationFormSchema>;

// `apartmentId` skips the picker, so a resident can share a link with their
// apartment already chosen.
export const RegistrationSearchSchema = z.object({
  apartmentId: z.string().optional(),
});
export type RegistrationSearch = z.infer<typeof RegistrationSearchSchema>;
