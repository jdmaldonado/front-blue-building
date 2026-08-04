import { LoginMode, type Session } from '@bb/core';

export const AppRoute = {
  Login: '/login',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  // The API email still links here (api/src/services/EmailService.ts:181).
  // The route only forwards to ResetPassword with the token.
  LegacyResetPassword: '/reset_password',
  Home: '/',
  // The profile belongs to the person, not to a building, so it hangs from the
  // root and works the same for a resident and for an admin.
  Account: '/account',
  Dashboard: '/dashboard',
  Admin: '/admin',
  AdminBuilding: '/admin/buildings/$buildingId',
  // The doors and cameras screen, the same one a resident sees.
  AdminBuildingLive: '/admin/buildings/$buildingId/live',
} as const;
export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];

// Where each session belongs. Login and guards both use this, so the rule lives
// in one place. The branch by RoleType will go here too.
export function landingPathFor(session: Session): AppRoute {
  switch (session.mode) {
    case LoginMode.Admin:
      return AppRoute.Admin;
    case LoginMode.Usuario:
      return AppRoute.Dashboard;
  }
}
