import { z } from 'zod';
import { RoleType, type Space } from '../auth';
import { IdSchema } from '../shared';
import { ApprovalScope } from './access-requests.constants';

// Who is asking to get in. The API sends no photo, even though the registration
// makes it mandatory (api/src/controllers/apartments/access/list_access_requests_dto.ts:8-16).
export const RequesterSchema = z.object({
  id: IdSchema,
  name: z.string(),
  cedula: z.string(),

  phone: z.string().nullish().catch(null),
  email: z.string().nullish().catch(null),
});
export type Requester = z.infer<typeof RequesterSchema>;

// Only the building list carries the apartment; the leader already knows which
// one is theirs.
export const RequestedApartmentSchema = z.object({
  id: IdSchema,
  name: z.string().nullish().catch(null),
  floor: z
    .object({
      name: z.string().nullish().catch(null),
      tower: z
        .object({ name: z.string().nullish().catch(null) })
        .nullish()
        .catch(null),
    })
    .nullish()
    .catch(null),
});
export type RequestedApartment = z.infer<typeof RequestedApartmentSchema>;

export const AccessRequestSchema = z.object({
  id: IdSchema,
  user: RequesterSchema,

  apartment: RequestedApartmentSchema.nullish().catch(null),
});
export type AccessRequest = z.infer<typeof AccessRequestSchema>;

export const AccessRequestsResponseSchema = z.object({ accessRequests: z.array(z.unknown()) });

export type AccessRequestList = {
  requests: AccessRequest[];
  skipped: number;
};

export const ResolveAccessRequestInputSchema = z.object({
  scope: z.enum(ApprovalScope),
  // The apartment or the building, depending on the scope.
  spaceId: IdSchema,
  requestId: IdSchema,
  approved: z.boolean(),
});
export type ResolveAccessRequestInput = z.infer<typeof ResolveAccessRequestInputSchema>;

// Where this person can approve. It comes from the spaces the login returned,
// so nothing has to be stored on the side.
export interface ApprovalPlace {
  scope: ApprovalScope;
  spaceId: string;
  label: string;
}

export function listApprovalPlaces(spaces: readonly Space[]): ApprovalPlace[] {
  const places: ApprovalPlace[] = [];

  for (const space of spaces) {
    if (space.role.name === RoleType.ResidenteLider && space.apartment) {
      places.push({
        scope: ApprovalScope.Apartment,
        spaceId: space.apartment.id,
        label: space.apartment.name ?? 'Mi apartamento',
      });
    }
    // The real check is `building.adminId === user.id`, which the API never
    // sends. The role is what the old app used too.
    if (space.role.name === RoleType.Administrador) {
      places.push({ scope: ApprovalScope.Building, spaceId: space.building.id, label: space.building.name });
    }
  }

  return places;
}
