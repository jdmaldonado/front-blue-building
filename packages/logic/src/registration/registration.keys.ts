export const registrationKeys = {
  all: ['registration'] as const,
  buildings: () => [...registrationKeys.all, 'buildings'] as const,
  towers: (buildingId: string | null) => [...registrationKeys.all, 'towers', buildingId] as const,
  floors: (towerId: string | null) => [...registrationKeys.all, 'floors', towerId] as const,
  apartments: (floorId: string | null, active: boolean) =>
    [...registrationKeys.all, 'apartments', floorId, active] as const,
};
