export const AccessPath = {
  // Every door of a building, unlike the one below, which only returns the ones
  // the user can open.
  BuildingDoors: '/api/bluebuilding/doors',
} as const;

export function accessibleDoorsPath(buildingId: string): string {
  return `/api/buildings/${buildingId}/doors`;
}

export function doorStatusesPath(buildingId: string): string {
  return `/api/buildings/${buildingId}/doors/statuses`;
}

export function towerFloorsPath(towerId: string): string {
  return `/api/towers/${towerId}/floors`;
}
