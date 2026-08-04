export const buildingKeys = {
  all: ['buildings'] as const,
  list: () => [...buildingKeys.all, 'list'] as const,
  apartments: (buildingId: string) => [...buildingKeys.all, buildingId, 'apartments'] as const,
};
