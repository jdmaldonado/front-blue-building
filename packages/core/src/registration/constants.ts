import { z } from 'zod';

// The eight the API accepts (api/src/entity/User.ts:28-37). Sending anything
// else fails validation on the server.
export const DocumentType = {
  CedulaCiudadania: 'CEDULA_CIUDADANIA',
  CedulaExtranjeria: 'CEDULA_EXTRANJERIA',
  Pasaporte: 'PASAPORTE',
  TarjetaIdentidad: 'TARJETA_IDENTIDAD',
  RegistroCivil: 'REGISTRO_CIVIL',
  CarneDiplomatico: 'CARNE_DIPLOMATICO',
  SalvoConductoPermanencia: 'SALVO_CONDUCTO_PERMANENCIA',
  PermisoEspecialPermanencia: 'PERMISO_ESPECIAL_PERMANENCIA',
} as const;
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
export const DocumentTypeSchema = z.enum(DocumentType);

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.CedulaCiudadania]: 'Cédula de ciudadanía',
  [DocumentType.CedulaExtranjeria]: 'Cédula de extranjería',
  [DocumentType.Pasaporte]: 'Pasaporte',
  [DocumentType.TarjetaIdentidad]: 'Tarjeta de identidad',
  [DocumentType.RegistroCivil]: 'Registro civil',
  [DocumentType.CarneDiplomatico]: 'Carné diplomático',
  [DocumentType.SalvoConductoPermanencia]: 'Salvoconducto de permanencia',
  [DocumentType.PermisoEspecialPermanencia]: 'Permiso especial de permanencia',
};

// Who is registering. It decides three things: the endpoint, which apartments
// can be picked, and who has to approve the request afterwards.
//
// - Owner  -> POST /api/apartments/:id/owner, apartments still inactive, the
//   building admin approves and the person ends up RESIDENTE_LIDER.
// - Resident -> POST /api/apartments/:id/users, active apartments only, the
//   leader of that apartment approves and the person ends up RESIDENTE.
export const ApartmentRole = {
  Owner: 'OWNER',
  Resident: 'RESIDENT',
} as const;
export type ApartmentRole = (typeof ApartmentRole)[keyof typeof ApartmentRole];
export const ApartmentRoleSchema = z.enum(ApartmentRole);

// An apartment without a leader has nobody to approve a resident, and the API
// answers 500 when that happens
// (api/src/controllers/apartments/users/controller.ts:52-56). The owner form
// asks for the inactive ones because those are the ones still looking for one.
export const APARTMENT_LIST_ACTIVE: Record<ApartmentRole, boolean> = {
  [ApartmentRole.Owner]: false,
  [ApartmentRole.Resident]: true,
};

// Every phone in the system is Colombian. The old form pasted the prefix on
// submit without showing it (front/src/views/Apartment/ownerRegister.js:379);
// here it is part of the field.
export const PHONE_COUNTRY_PREFIX = '+57';
export const PHONE_DIGITS = 10;

// The photo travels in the same request as the form, and the API keeps it in S3
// (api/src/services/S3Service.ts:24). The limit is ours: nothing on the server
// rejects a huge file, it just takes the upload down with it on a phone.
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
