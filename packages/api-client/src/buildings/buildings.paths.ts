export const BuildingsPath = {
  List: '/api/bluebuilding/buildings',
} as const;

export function maintenancePath(buildingId: string): string {
  return `/api/bluebuilding/buildings/${buildingId}/maintenance`;
}

export function buildingApartmentsPath(buildingId: string): string {
  return `/api/bluebuilding/buildings/${buildingId}/apartments`;
}
