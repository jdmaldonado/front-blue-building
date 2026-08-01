// Mirrors `BuildingType` in the API (api/src/entity/Building.ts:16). Careful: the
// residential building is stored as 'RESIDENTIAL', not 'APARTAMENT'.
export const BuildingType = {
  Business: 'BUSINESS',
  Residential: 'RESIDENTIAL',
} as const;
export type BuildingType = (typeof BuildingType)[keyof typeof BuildingType];

// Mirrors `ApartmentType` in the API (api/src/entity/Apartment.ts:19).
export const ApartmentType = {
  Internal: 'INTERNAL',
  Business: 'BUSINESS',
  Apartament: 'APARTAMENT',
  Visitor: 'VISITOR',
} as const;
export type ApartmentType = (typeof ApartmentType)[keyof typeof ApartmentType];
