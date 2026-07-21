import {
  AuthNetworkError,
  DoorSchema,
  DoorStatusesSchema,
  FloorSchema,
  InvalidCredentialsError,
  LoginMode,
  LoginResponseSchema,
  UnknownAuthError,
  type Door,
  type DoorStatuses,
  type Floor,
  type LoginResponse,
} from '@bb/core';
import { z } from 'zod';
import { HttpError, type HttpClient } from './http';

export interface LoginInput {
  cedula: string;
  password: string;
  mode: LoginMode;
}

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

  async login(input: LoginInput): Promise<LoginResponse> {
    try {
      const raw = await this.http.post({
        path: loginPath(input.mode),
        body: { cedula: input.cedula, password: input.password },
      });
      return LoginResponseSchema.parse(raw);
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
