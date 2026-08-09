export const UsersPath = {
  Residents: '/api/bluebuilding/usersV2/ResidentUserDetails',
  Validate: '/api/bluebuilding/userv2',
} as const;

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
