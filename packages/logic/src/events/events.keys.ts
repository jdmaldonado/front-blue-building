export const eventKeys = {
  all: ['events'] as const,
  critical: () => [...eventKeys.all, 'critical'] as const,
  intrusions: (buildingId: string, page: number) => [...eventKeys.all, 'intrusions', buildingId, page] as const,
  openDoor: (buildingId: string, page: number) => [...eventKeys.all, 'open-door', buildingId, page] as const,
};
