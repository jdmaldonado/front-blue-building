export const UsersPath = {
  Residents: '/api/bluebuilding/usersV2/ResidentUserDetails',
  Validate: '/api/bluebuilding/userv2',
} as const;

// The endpoint keeps answering the plain list while no page is asked for
// (api/src/2.0/users/controllers/UserControllerV2.ts:152-158), so only the
// filter travels here.
export function residentsPath(buildingId?: string | null): string {
  if (buildingId === null || buildingId === undefined || buildingId === '') {
    return UsersPath.Residents;
  }
  return `${UsersPath.Residents}?buildingId=${encodeURIComponent(buildingId)}`;
}

export function apartmentUsersPath(apartmentId: string): string {
  return `/api/bluebuilding/apartments/${apartmentId}/users`;
}

export function userByDocumentPath(document: string): string {
  return `/api/bluebuilding/users/${encodeURIComponent(document)}`;
}

export function residentPath(userId: string): string {
  return `/api/bluebuilding/userV2/${userId}`;
}

export function residentActivationPath(userId: string, active: boolean): string {
  return `/api/bluebuilding/usersV2/${userId}/${active ? 'activate' : 'deactivate'}`;
}
