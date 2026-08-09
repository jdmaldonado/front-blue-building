import { z } from 'zod';

export const ApartmentRole = {
  Owner: 'OWNER',
  Resident: 'RESIDENT',
} as const;
export type ApartmentRole = (typeof ApartmentRole)[keyof typeof ApartmentRole];
export const ApartmentRoleSchema = z.enum(ApartmentRole);

// An owner claims an apartment nobody leads yet, so that form lists the
// inactive ones. A resident joins one that already has a leader, because the
// leader is who approves them (api/src/controllers/apartments/users/controller.ts:52-56).
export const APARTMENT_LIST_ACTIVE: Record<ApartmentRole, boolean> = {
  [ApartmentRole.Owner]: false,
  [ApartmentRole.Resident]: true,
};

export const PHONE_COUNTRY_PREFIX = '+57';
export const PHONE_DIGITS = 10;

// Ours, not the API's: nothing on the server rejects a huge file.
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
