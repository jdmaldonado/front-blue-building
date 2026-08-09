import { LoginMode } from '@bb/core';

export const AuthPath = {
  ForgotPassword: '/api/user/auth/forgotPassword',
  ResetPassword: '/api/user/auth/resetPassword',
} as const;

export function loginPath(mode: LoginMode): string {
  switch (mode) {
    case LoginMode.Usuario:
      return '/api/user/auth/login';
    case LoginMode.Admin:
      return '/api/bluebuilding/auth/login';
  }
}
