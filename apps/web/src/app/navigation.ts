import { LoginMode, type Session } from '@bb/core';

export const AppRoute = {
  Login: '/login',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  // The API email template still points here
  // (api/src/services/EmailService.ts:181): SITE_URL/reset_password?token=...
  // The route only forwards to ResetPassword keeping the token. It can be
  // deleted once the template is updated AND the old links have expired.
  LegacyResetPassword: '/reset_password',
  Home: '/',
  Admin: '/admin',
} as const;
export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];

// Single place that answers "where does this session belong". Both the login
// (after a successful submit) and the route guards use it, so there is no second
// copy of the rule to drift.
//
// Today it only splits by login mode. When the resident area grows, the branch
// by `RoleType` of the selected space goes here too, and nowhere else.
export function landingPathFor(session: Session): AppRoute {
  switch (session.mode) {
    case LoginMode.Admin:
      return AppRoute.Admin;
    case LoginMode.Usuario:
      return AppRoute.Home;
  }
}
