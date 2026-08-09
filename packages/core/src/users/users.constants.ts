import { z } from 'zod';

// How a person identifies themselves. Belongs to the person, not to the act of
// registering: these are the only eight the API accepts
// (api/src/entity/User.ts:28-37).
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
