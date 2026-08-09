import { z } from 'zod';

// The only eight the API accepts (api/src/entity/User.ts:28-37).
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

export const ApartmentRole = {
  Owner: 'OWNER',
  Resident: 'RESIDENT',
} as const;
export type ApartmentRole = (typeof ApartmentRole)[keyof typeof ApartmentRole];
export const ApartmentRoleSchema = z.enum(ApartmentRole);

// An owner claims an apartment nobody leads yet, so that form lists the
// inactive ones. A resident joins one that already has a leader, because the
// leader is who approves them (api/src/controllers/apartments/users/controller.ts:52-56).
export const APARTMENT_LIST_ACTIVE: Record<ApartmentRole, boolean> = {
  [ApartmentRole.Owner]: false,
  [ApartmentRole.Resident]: true,
};

export const PHONE_COUNTRY_PREFIX = '+57';
export const PHONE_DIGITS = 10;

// Ours, not the API's: nothing on the server rejects a huge file.
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
