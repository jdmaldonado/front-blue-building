import { z } from 'zod';

// Who is approving, which decides the endpoint and what the answer means.
//
// - Apartment: the leader of an apartment approving its residents. Approving
//   creates a RESIDENTE.
// - Building: the administrator of a building approving apartment leaders.
//   Approving creates a RESIDENTE_LIDER and turns the apartment on.
export const ApprovalScope = {
  Apartment: 'APARTMENT',
  Building: 'BUILDING',
} as const;
export type ApprovalScope = (typeof ApprovalScope)[keyof typeof ApprovalScope];
export const ApprovalScopeSchema = z.enum(ApprovalScope);
