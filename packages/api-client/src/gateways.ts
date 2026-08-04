import {
  AdminLoginResponseSchema,
  AuthNetworkError,
  BuildingSchema,
  BuildingsNetworkError,
  InvalidResetTokenError,
  DoorSchema,
  DoorStatusesSchema,
  FloorSchema,
  InvalidCredentialsError,
  LoginMode,
  NoSpacesAssignedError,
  SessionExpiredError,
  UnknownAuthError,
  UnknownBuildingsError,
  UserLoginResponseSchema,
  WeakPasswordError,
  type Building,
  type Door,
  type DoorStatuses,
  type Floor,
  type ForgotPasswordInput,
  type LoginInput,
  type MaintenanceInput,
  type ResetPasswordInput,
  type Session,
} from '@bb/core';
import { z } from 'zod';
import { HttpError, type HttpClient } from './http';

const AuthPath = {
  ForgotPassword: '/api/user/auth/forgotPassword',
  ResetPassword: '/api/user/auth/resetPassword',
} as const;

function loginPath(mode: LoginMode): string {
  switch (mode) {
    case LoginMode.Usuario:
      return '/api/user/auth/login';
    case LoginMode.Admin:
      return '/api/bluebuilding/auth/login';
  }
}

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

function toResetPasswordError(error: unknown): Error {
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new AuthNetworkError('Network error during password reset', { cause: error });
    }
    // 403 means the token is unknown, expired or already used.
    if (error.status === 403) {
      return new InvalidResetTokenError('Reset token is no longer valid');
    }
    if (error.status === 422 || error.status === 400) {
      return new WeakPasswordError('Password does not meet the minimum length');
    }
  }
  return new UnknownAuthError('Unexpected password reset error', { cause: error });
}

function toAuthError(error: unknown): Error {
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new AuthNetworkError('Network error during login', { cause: error });
    }
    if (error.status === 400 || error.status === 401) {
      return new InvalidCredentialsError('Invalid credentials');
    }
    // Valid user, but no apartment assigned.
    if (error.status === 403) {
      return new NoSpacesAssignedError('User has no spaces assigned');
    }
  }
  return new UnknownAuthError('Unexpected login error', { cause: error });
}

// `/api/buildings` has no auth at all (api/src/routes/api.ts:83) and the legacy
// registration forms still use it. The admin panel uses the guarded route:
// JWT + SUPER_USER (api/src/routes/BlueBuildingRoutes.ts:137-142).
const BuildingsPath = {
  List: '/api/bluebuilding/buildings',
} as const;

function maintenancePath(buildingId: string): string {
  return `/api/bluebuilding/buildings/${buildingId}/maintenance`;
}

export class BuildingsGateway {
  constructor(private readonly http: HttpClient) {}

  async listBuildings(): Promise<Building[]> {
    try {
      // This route answers the array directly, without a `buildings` wrapper.
      const raw = await this.http.get({ path: BuildingsPath.List });
      return z.array(BuildingSchema).parse(raw);
    } catch (error) {
      throw toBuildingsError(error);
    }
  }

  // Maintenance does not turn anything off: it stops the SMS and calls for the
  // building until the date it returns.
  async enableMaintenance(input: MaintenanceInput): Promise<Building> {
    try {
      const raw = await this.http.put({
        path: maintenancePath(input.buildingId),
        body: { durationMinutes: input.durationMinutes },
      });
      return BuildingSchema.parse(raw);
    } catch (error) {
      throw toBuildingsError(error);
    }
  }

  async disableMaintenance(buildingId: string): Promise<Building> {
    try {
      const raw = await this.http.delete({ path: maintenancePath(buildingId) });
      return BuildingSchema.parse(raw);
    } catch (error) {
      throw toBuildingsError(error);
    }
  }
}

function toBuildingsError(error: unknown): Error {
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new BuildingsNetworkError('Network error while listing buildings', { cause: error });
    }
    // The API answers 401 both for a dead token and for a user who is not
    // SUPER_USER (api/src/services/AuthService.ts:71-78).
    if (error.status === 401) {
      return new SessionExpiredError('Session is no longer valid', { cause: error });
    }
  }
  return new UnknownBuildingsError('Unexpected error while listing buildings', { cause: error });
}

export class AccessGateway {
  constructor(private readonly http: HttpClient) {}

  async getAccessibleDoors(buildingId: string): Promise<Door[]> {
    const raw = await this.http.get({ path: `/api/buildings/${buildingId}/doors` });
    return z.object({ doors: z.array(DoorSchema) }).parse(raw).doors;
  }

  // Empty after an API restart: this state lives in memory. A missing door
  // means no report, not closed.
  async getDoorStatuses(buildingId: string): Promise<DoorStatuses> {
    const raw = await this.http.get({ path: `/api/buildings/${buildingId}/doors/statuses` });
    return DoorStatusesSchema.parse(raw);
  }

  async getTowerFloors(towerId: string): Promise<Floor[]> {
    const raw = await this.http.get({ path: `/api/towers/${towerId}/floors` });
    return z.array(FloorSchema).parse(raw);
  }
}
