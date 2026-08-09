import { ApartmentRole } from '@bb/core';

// Every route here is public (api/src/routes/api.ts:83-115). That is also what
// lets a resident who is already logged in open the same form later on.
export const RegistrationPath = {
  Buildings: '/api/buildings',
} as const;

export function buildingTowersPath(buildingId: string): string {
  return `/api/buildings/${buildingId}/towers`;
}

export function towerFloorsPath(towerId: string): string {
  return `/api/towers/${towerId}/floors`;
}

export function floorApartmentsPath(floorId: string, active: boolean): string {
  return `/api/floors/${floorId}/apartments?active=${String(active)}`;
}

export function registerPath(role: ApartmentRole, apartmentId: string): string {
  switch (role) {
    case ApartmentRole.Owner:
      return `/api/apartments/${apartmentId}/owner`;
    case ApartmentRole.Resident:
      return `/api/apartments/${apartmentId}/users`;
  }
}
