import {
  AdminLoginResponseSchema,
  AuthNetworkError,
  DoorSchema,
  DoorStatusesSchema,
  FloorSchema,
  InvalidCredentialsError,
  LoginMode,
  NoSpacesAssignedError,
  UnknownAuthError,
  UserLoginResponseSchema,
  type Door,
  type DoorStatuses,
  type Floor,
  type LoginInput,
  type Session,
} from '@bb/core';
import { z } from 'zod';
import { HttpError, type HttpClient } from './http';

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

  // Each endpoint answers a different shape, so each one is parsed with its own
  // schema and normalized into the domain Session here.
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
}

function toAuthError(error: unknown): Error {
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new AuthNetworkError('Network error during login', { cause: error });
    }
    if (error.status === 400 || error.status === 401) {
      return new InvalidCredentialsError('Invalid credentials');
    }
    // Valid user with no apartment assigned.
    if (error.status === 403) {
      return new NoSpacesAssignedError('User has no spaces assigned');
    }
  }
  return new UnknownAuthError('Unexpected login error', { cause: error });
}

export class AccessGateway {
  constructor(private readonly http: HttpClient) {}

  async getAccessibleDoors(buildingId: string): Promise<Door[]> {
    const raw = await this.http.get({ path: `/api/buildings/${buildingId}/doors` });
    return z.object({ doors: z.array(DoorSchema) }).parse(raw).doors;
  }

  async getDoorStatuses(buildingId: string): Promise<DoorStatuses> {
    const raw = await this.http.get({ path: `/api/buildings/${buildingId}/doors/statuses` });
    return DoorStatusesSchema.parse(raw);
  }

  async getTowerFloors(towerId: string): Promise<Floor[]> {
    const raw = await this.http.get({ path: `/api/towers/${towerId}/floors` });
    return z.array(FloorSchema).parse(raw);
  }
}
