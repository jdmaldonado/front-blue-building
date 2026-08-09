import {
  ResidentDetailsEntrySchema,
  ResidentDetailsResponseSchema,
  UserAccountResponseSchema,
  type ResidentList,
  type SetResidentActiveInput,
  type UpdateResidentInput,
  type UserAccount,
} from '@bb/core';
import type { Logger } from '@bb/logger';
import type { HttpClient } from '../http';
import { readRows } from '../shared';
import { toUserLookupError, toUsersError } from './users.errors';
import { UsersPath, apartmentUsersPath, residentActivationPath, residentPath, userByDocumentPath } from './users.paths';

// Files, so this input cannot live in `core`: that package has no DOM types.
export interface ValidateUserInput {
  cedula: string;
  photo: File;
  documentFront: File;
  documentBack: File;
}

// The list nests each user inside `{ user: ... }`; the screen wants the user.
const ResidentRowSchema = ResidentDetailsEntrySchema.transform((entry) => entry.user);

export class UsersGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  // Reads every resident in every building. There is no filter or paging yet
  // (docs 07-abierto/propuestas-panel-admin.md).
  async listResidents(): Promise<ResidentList> {
    return this.readResidents(UsersPath.Residents);
  }

  async listApartmentResidents(apartmentId: string): Promise<ResidentList> {
    return this.readResidents(apartmentUsersPath(apartmentId));
  }

  // The card screen starts here: one document in, one person out.
  async getByDocument(document: string): Promise<UserAccount> {
    try {
      const raw = await this.http.get({ path: userByDocumentPath(document) });
      return UserAccountResponseSchema.parse(raw).user;
    } catch (error) {
      throw toUserLookupError(error);
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
      throw toUserLookupError(error);
    }
  }

  // Only the phone travels. The old panel also sent `alias`, but it had no
  // field for it, so the value was always empty (front/src/components/UsersList.jsx:49).
  async updateResident(input: UpdateResidentInput): Promise<void> {
    try {
      await this.http.put({ path: residentPath(input.userId), body: { phone: input.phone } });
    } catch (error) {
      throw toUsersError(error);
    }
  }

  async setResidentActive(input: SetResidentActiveInput): Promise<void> {
    const body = input.active ? { shouldActivateCards: input.withCards } : { shouldDeactivateCards: input.withCards };

    try {
      await this.http.put({ path: residentActivationPath(input.userId, input.active), body });
    } catch (error) {
      throw toUsersError(error);
    }
  }

  private async readResidents(path: string): Promise<ResidentList> {
    try {
      const raw = await this.http.get({ path });
      const rows = ResidentDetailsResponseSchema.parse(raw);
      const { items, skipped } = readRows(rows, ResidentRowSchema, { logger: this.logger, path, label: 'Resident' });
      return { residents: items, skipped };
    } catch (error) {
      throw toUsersError(error);
    }
  }
}
