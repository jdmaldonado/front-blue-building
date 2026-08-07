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
  CardEntrySchema,
  CriticalEventSchema,
  EventsContractError,
  EventsNetworkError,
  IncidentNotFoundError,
  IntrusionEventSchema,
  OpenDoorEventSchema,
  PagedEventsResponseSchema,
  CardsContractError,
  CardsNetworkError,
  CardsResponseSchema,
  CardNotFoundError,
  SessionExpiredError,
  ResidentDetailsEntrySchema,
  ResidentDetailsResponseSchema,
  UnknownAuthError,
  UnknownBuildingsError,
  UnknownCardsError,
  UnknownEventsError,
  UnknownUsersError,
  UserAccountResponseSchema,
  UserNotFoundError,
  UserNotVerifiedError,
  UsersContractError,
  UsersNetworkError,
  UserLoginResponseSchema,
  WeakPasswordError,
  type Apartment,
  type Building,
  type Card,
  type CardList,
  type CriticalEventList,
  type EventPage,
  type IntrusionEvent,
  type OpenDoorEvent,
  type ResolveIncidentInput,
  type StartIncidentInput,
  type CreateCardInput,
  type Door,
  type DoorStatuses,
  type Floor,
  type ForgotPasswordInput,
  type LoginInput,
  type MaintenanceInput,
  type ResetPasswordInput,
  type ResidentDetails,
  type ResidentList,
  type UpdateCardInput,
  type UserAccount,
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

const AccessPath = {
  BuildingDoors: '/api/bluebuilding/doors',
} as const;

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

  // Every door of the building, not only the ones the user can open. The card
  // screen needs them all to pick which reader goes into register mode.
  //
  // Careful: this one returns bare door rows. It joins floor and tower without
  // selecting them and never loads the cameras (DoorServiceV2.ts:12-18), so
  // `cameras` always parses to [] and `floor` to null. For cameras or floors,
  // use `getAccessibleDoors`.
  async listBuildingDoors(buildingId: string): Promise<Door[]> {
    const raw = await this.http.post({ path: AccessPath.BuildingDoors, body: { buildingId } });
    return BuildingDoorsResponseSchema.parse(raw);
  }

  async getTowerFloors(towerId: string): Promise<Floor[]> {
    const raw = await this.http.get({ path: `/api/towers/${towerId}/floors` });
    return z.array(FloorSchema).parse(raw);
  }
}

const UsersPath = {
  Residents: '/api/bluebuilding/usersV2/ResidentUserDetails',
  Validate: '/api/bluebuilding/userv2',
} as const;

const NOT_FOUND_STATUS = 404;

function apartmentUsersPath(apartmentId: string): string {
  return `/api/bluebuilding/apartments/${apartmentId}/users`;
}

function userByDocumentPath(document: string): string {
  return `/api/bluebuilding/users/${encodeURIComponent(document)}`;
}

// Files, so this input cannot live in `core`: that package has no DOM types.
export interface ValidateUserInput {
  cedula: string;
  photo: File;
  documentFront: File;
  documentBack: File;
}

// The endpoint answers a bare list, but the sibling one wraps it in `doors`.
// Accept both instead of guessing.
const BuildingDoorsResponseSchema = z.union([
  z.array(DoorSchema),
  z.object({ doors: z.array(DoorSchema) }).transform((value) => value.doors),
]);

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

  // The card screen starts here: one document in, one person out.
  async getByDocument(document: string): Promise<UserAccount> {
    try {
      const raw = await this.http.get({ path: userByDocumentPath(document) });
      return UserAccountResponseSchema.parse(raw).user;
    } catch (error) {
      if (error instanceof HttpError && error.status === NOT_FOUND_STATUS) {
        throw new UserNotFoundError('No user with that document', { cause: error });
      }
      throw toUsersError(error);
    }
  }

  // Photo and both sides of the document. Multipart, so the body is FormData and
  // the browser writes the content type.
  async validate(input: ValidateUserInput): Promise<void> {
    const body = new FormData();
    body.set('cedula', input.cedula);
    body.set('photo', input.photo);
    body.set('cedulaFrontal', input.documentFront);
    body.set('cedulaPosterior', input.documentBack);

    try {
      await this.http.post({ path: UsersPath.Validate, body });
    } catch (error) {
      if (error instanceof HttpError && error.status === NOT_FOUND_STATUS) {
        throw new UserNotFoundError('No user with that document', { cause: error });
      }
      throw toUsersError(error);
    }
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

const CardsPath = {
  Cards: '/api/bluebuilding/cardsv2',
} as const;

function cardPath(cardId: string): string {
  return `${CardsPath.Cards}/${cardId}`;
}

export class CardsGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  async listByDocument(document: string): Promise<CardList> {
    const path = `${CardsPath.Cards}?document=${encodeURIComponent(document)}`;
    try {
      const raw = await this.http.get({ path });
      return this.toCardList(raw, path);
    } catch (error) {
      throw toCardsError(error);
    }
  }

  async create(input: CreateCardInput): Promise<void> {
    try {
      await this.http.post({ path: CardsPath.Cards, body: input });
    } catch (error) {
      throw toCardsError(error);
    }
  }

  async update(input: UpdateCardInput): Promise<void> {
    try {
      await this.http.put({
        path: cardPath(input.cardId),
        body: { tag: input.tag, type: input.type, active: input.active },
      });
    } catch (error) {
      throw toCardsError(error);
    }
  }

  // Hard delete on the API: there is no bin to recover it from.
  async remove(cardId: string): Promise<void> {
    try {
      await this.http.delete({ path: cardPath(cardId) });
    } catch (error) {
      throw toCardsError(error);
    }
  }

  // Row by row, like the resident list: a card we cannot read costs that card.
  private toCardList(raw: unknown, path: string): CardList {
    const entries = CardsResponseSchema.parse(raw);
    const cards: Card[] = [];
    let skipped = 0;

    for (const entry of entries) {
      const parsed = CardEntrySchema.safeParse(entry);
      if (parsed.success) {
        cards.push(parsed.data.card);
        continue;
      }
      skipped += 1;
      this.logger.warn('Card record dropped', { path, issues: parsed.error.issues });
    }

    return { cards, skipped };
  }
}

function toCardsError(error: unknown): Error {
  if (error instanceof z.ZodError) {
    return new CardsContractError('Cards response does not match the contract', { cause: error });
  }
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new CardsNetworkError('Network error while reading cards', { cause: error });
    }
    if (error.status === 401) {
      return new SessionExpiredError('Session is no longer valid', { cause: error });
    }
    if (error.status === NOT_FOUND_STATUS) {
      return new CardNotFoundError('Card no longer exists', { cause: error });
    }
    // The API refuses to create a card for a user without photo and document.
    if (isUserNotVerified(error)) {
      return new UserNotVerifiedError('User has no photo or document on file', { cause: error });
    }
  }
  return new UnknownCardsError('Unexpected error while working with cards', { cause: error });
}

function isUserNotVerified(error: HttpError): boolean {
  const body = z.object({ error: z.string() }).catch({ error: '' }).parse(error.body);
  return body.error.includes('UserNotVerified');
}

const EventsPath = {
  Critical: '/api/bluebuilding/events/critical/recent',
  Intrusions: '/api/bluebuilding/events/event-intrusion',
  OpenDoor: '/api/bluebuilding/events/open-door',
  IncidentStart: '/api/bluebuilding/event-incident/start',
  IncidentResolve: '/api/bluebuilding/event-incident/resolve',
} as const;

export interface EventPageInput {
  buildingId?: string | null;
  page: number;
  limit: number;
}

function eventsQuery(input: EventPageInput): string {
  const query = new URLSearchParams({ page: String(input.page), limit: String(input.limit) });
  if (input.buildingId !== null && input.buildingId !== undefined && input.buildingId !== '') {
    query.set('buildingId', input.buildingId);
  }
  return query.toString();
}

export class EventsGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  // Fifteen most recent, no paging and no filters: the API decides what counts
  // as critical with a fixed blacklist (api/.../EventService.ts:15-17).
  async listCriticalEvents(): Promise<CriticalEventList> {
    try {
      const raw = await this.http.get({ path: EventsPath.Critical });
      const rows = z.array(z.unknown()).parse(raw);
      const { items, skipped } = this.readRows(rows, CriticalEventSchema, EventsPath.Critical);
      return { events: items, skipped };
    } catch (error) {
      throw toEventsError(error);
    }
  }

  async listIntrusions(input: EventPageInput): Promise<EventPage<IntrusionEvent>> {
    const path = `${EventsPath.Intrusions}?${eventsQuery(input)}`;
    try {
      const raw = await this.http.get({ path });
      return this.readPage(raw, 'eventIntrusionDetails', IntrusionEventSchema, path);
    } catch (error) {
      throw toEventsError(error);
    }
  }

  async listOpenDoorEvents(input: EventPageInput): Promise<EventPage<OpenDoorEvent>> {
    const path = `${EventsPath.OpenDoor}?${eventsQuery(input)}`;
    try {
      const raw = await this.http.get({ path });
      return this.readPage(raw, 'eventOpenDoorDetails', OpenDoorEventSchema, path);
    } catch (error) {
      throw toEventsError(error);
    }
  }

  async startIncident(input: StartIncidentInput): Promise<void> {
    try {
      await this.http.put({ path: EventsPath.IncidentStart, body: input });
    } catch (error) {
      throw toEventsError(error);
    }
  }

  async resolveIncident(input: ResolveIncidentInput): Promise<void> {
    try {
      await this.http.put({ path: EventsPath.IncidentResolve, body: input });
    } catch (error) {
      throw toEventsError(error);
    }
  }

  private readPage<TItem>(raw: unknown, key: string, schema: z.ZodType<TItem>, path: string): EventPage<TItem> {
    const envelope = PagedEventsResponseSchema.parse(raw);
    const rows = z.object({ [key]: z.array(z.unknown()).catch([]) }).parse(raw)[key] as unknown[];
    const { items, skipped } = this.readRows(rows, schema, path);

    return {
      items,
      page: envelope.page,
      totalPages: envelope.totalPages,
      totalRecords: envelope.totalRecords,
      skipped,
    };
  }

  // Row by row, like residents and cards: one unreadable record costs that
  // record, and its reason goes to the log.
  private readRows<TItem>(
    rows: unknown[],
    schema: z.ZodType<TItem>,
    path: string,
  ): { items: TItem[]; skipped: number } {
    const items: TItem[] = [];
    let skipped = 0;

    for (const row of rows) {
      const parsed = schema.safeParse(row);
      if (parsed.success) {
        items.push(parsed.data);
        continue;
      }
      skipped += 1;
      this.logger.warn('Event record dropped', { path, issues: parsed.error.issues });
    }

    return { items, skipped };
  }
}

function toEventsError(error: unknown): Error {
  if (error instanceof z.ZodError) {
    return new EventsContractError('Events response does not match the contract', { cause: error });
  }
  if (error instanceof HttpError) {
    if (error.status === null) {
      return new EventsNetworkError('Network error while reading events', { cause: error });
    }
    if (error.status === 401) {
      return new SessionExpiredError('Session is no longer valid', { cause: error });
    }
    if (error.status === NOT_FOUND_STATUS) {
      return new IncidentNotFoundError('There is no incident for that event', { cause: error });
    }
  }
  return new UnknownEventsError('Unexpected error while reading events', { cause: error });
}
