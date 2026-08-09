export const accessKeys = {
  all: ['access'] as const,
  doors: (buildingId: string | null) => [...accessKeys.all, 'doors', buildingId] as const,
  doorStatuses: (buildingId: string | null) => [...accessKeys.all, 'door-statuses', buildingId] as const,
  buildingDoors: (buildingId: string) => [...accessKeys.all, 'building-doors', buildingId] as const,
  floors: (towerId: string | null) => [...accessKeys.all, 'floors', towerId] as const,
};
