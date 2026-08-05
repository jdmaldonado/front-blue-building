import {
  AdminLoginResponseSchema,
  ApartmentSchema,
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
  ResidentDetailsEntrySchema,
  ResidentDetailsResponseSchema,
  UnknownAuthError,
  UnknownBuildingsError,
  UnknownUsersError,
  UsersContractError,
  UsersNetworkError,
  UserLoginResponseSchema,
  WeakPasswordError,
  type Apartment,
  type Building,
  type Door,
  type DoorStatuses,
  type Floor,
  type ForgotPasswordInput,
  type LoginInput,
  type MaintenanceInput,
  type ResetPasswordInput,
  type ResidentDetails,
  type ResidentList,
  type SetResidentActiveInput,
  type UpdateResidentInput,
  type Session,
} from '@bb/core';
import type { Logger } from '@bb/logger';
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

function apartmentsPath(buildingId: string): string {
  return `/api/bluebuilding/buildings/${buildingId}/apartments`;
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

  // Visitor apartments never come back: the API filters them out
  // (api/src/2.0/apartaments/services/ApartmentServiceV2.ts:50).
  async listApartments(buildingId: string): Promise<Apartment[]> {
    try {
      const raw = await this.http.get({ path: apartmentsPath(buildingId) });
      return z.array(ApartmentSchema).parse(raw);
    } catch (error) {
      throw toBuildingsError(error);
    }
  }

  // Named after what it does, not after the HTTP verb: it deletes the cards,
  // marks the residents as EX_RESIDENTE and leaves an empty apartment behind
  // (api/src/2.0/apartaments/controllers/ApartmentControllerV2.ts:9).
  async retireApartment(input: { buildingId: string; apartmentId: string }): Promise<void> {
    try {
      await this.http.delete({ path: `${apartmentsPath(input.buildingId)}/${input.apartmentId}` });
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

const UsersPath = {
  Residents: '/api/bluebuilding/usersV2/ResidentUserDetails',
} as const;

function apartmentUsersPath(apartmentId: string): string {
  return `/api/bluebuilding/apartments/${apartmentId}/users`;
}

export class UsersGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  // Reads every resident in every building. There is no filter or paging yet
  // (docs 07-abierto/propuestas-panel-admin.md).
  async listResidents(): Promise<ResidentList> {
    try {
      const raw = await this.http.get({ path: UsersPath.Residents });
      return this.toResidentList(raw, UsersPath.Residents);
    } catch (error) {
      throw toUsersError(error);
    }
  }

  async listApartmentResidents(apartmentId: string): Promise<ResidentList> {
    const path = apartmentUsersPath(apartmentId);
    try {
      const raw = await this.http.get({ path });
      return this.toResidentList(raw, path);
    } catch (error) {
      throw toUsersError(error);
    }
  }

  // Read row by row. One record we cannot identify costs that record, not the
  // screen; and it leaves its reason in the log, which is where it gets fixed.
  private toResidentList(raw: unknown, path: string): ResidentList {
    const entries = ResidentDetailsResponseSchema.parse(raw);
    const residents: ResidentDetails[] = [];
    let skipped = 0;

    for (const entry of entries) {
      const parsed = ResidentDetailsEntrySchema.safeParse(entry);
      if (parsed.success) {
        residents.push(parsed.data.user);
        continue;
      }
      skipped += 1;
      this.logger.warn('Resident record dropped', { path, issues: parsed.error.issues });
    }

    return { residents, skipped };
  }

  // Only the phone travels. The old panel also sent `alias`, but it had no
  // field for it, so the value was always empty (front/src/components/UsersList.jsx:49).
  async updateResident(input: UpdateResidentInput): Promise<void> {
    try {
      await this.http.put({
        path: `/api/bluebuilding/userV2/${input.userId}`,
        body: { phone: input.phone },
      });
    } catch (error) {
      throw toUsersError(error);
    }
  }

  async setResidentActive(input: SetResidentActiveInput): Promise<void> {
    const action = input.active ? 'activate' : 'deactivate';
    const body = input.active ? { shouldActivateCards: input.withCards } : { shouldDeactivateCards: input.withCards };

    try {
      await this.http.put({ path: `/api/bluebuilding/usersV2/${input.userId}/${action}`, body });
    } catch (error) {
      throw toUsersError(error);
    }
  }
}

function toUsersError(error: unknown): Error {
  // Not the network: the answer is not a list of users at all.
  if (error instanceof z.ZodError) {
    return new UsersContractError('Users response does not match the contract', { cause: error });
  }
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new UsersNetworkError('Network error while reading users', { cause: error });
    }
    if (error.status === 401) {
      return new SessionExpiredError('Session is no longer valid', { cause: error });
    }
  }
  return new UnknownUsersError('Unexpected error while reading users', { cause: error });
}
