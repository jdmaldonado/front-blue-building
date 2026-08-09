import {
  AdminLoginResponseSchema,
  LoginMode,
  UserLoginResponseSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type ResetPasswordInput,
  type Session,
} from '@bb/core';
import type { HttpClient } from '../http';
import { toAuthError, toResetPasswordError } from './auth.errors';
import { AuthPath, loginPath } from './auth.paths';

export class AuthGateway {
  constructor(private readonly http: HttpClient) {}

  // Each endpoint answers a different shape. We parse each one and return the
  // same Session.
  async login(input: LoginInput): Promise<Session> {
    try {
      const raw = await this.http.post({
        path: loginPath(input.mode),
        body: { cedula: input.cedula, password: input.password },
      });

      switch (input.mode) {
        case LoginMode.Usuario: {
          const { token, user, spaces } = UserLoginResponseSchema.parse(raw);
          return { mode: LoginMode.Usuario, token, user, spaces };
        }
        case LoginMode.Admin: {
          const { token, user } = AdminLoginResponseSchema.parse(raw);
          return { mode: LoginMode.Admin, token, user };
        }
      }
    } catch (error) {
      throw toAuthError(error);
    }
  }

  // The API answers 204 even for unknown documents, so nobody can guess which
  // ones exist (api/src/controllers/users/auth/controller.ts:97-100).
  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    try {
      await this.http.post({ path: AuthPath.ForgotPassword, body: { cedula: input.cedula } });
    } catch (error) {
      throw toAuthError(error);
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    try {
      await this.http.post({
        path: AuthPath.ResetPassword,
        body: { token: input.token, password: input.password },
      });
    } catch (error) {
      throw toResetPasswordError(error);
    }
  }
}
