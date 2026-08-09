import {
  ApartmentSchema,
  BuildingSchema,
  FloorSchema,
  PHONE_COUNTRY_PREFIX,
  TowerSchema,
  type Apartment,
  type ApartmentRole,
  type Building,
  type Floor,
  type RegistrationDetails,
  type Tower,
} from '@bb/core';
import { z } from 'zod';
import type { HttpClient } from '../http';
import { toRegistrationError } from './registration.errors';
import {
  RegistrationPath,
  buildingTowersPath,
  floorApartmentsPath,
  registerPath,
  towerFloorsPath,
} from './registration.paths';

// The photo is a `File`, so this input cannot live in `core`: that package has
// no DOM types.
export interface RegisterApartmentUserInput extends RegistrationDetails {
  role: ApartmentRole;
  apartmentId: string;
  photo: File;
}

// `{ buildings: [...] }` here, unlike the admin list, which answers the array
// directly (api/src/controllers/buildings/list_buildings_dto.ts:3).
const PublicBuildingsResponseSchema = z.object({ buildings: z.array(BuildingSchema) });

export class RegistrationGateway {
  constructor(private readonly http: HttpClient) {}

  async listBuildings(): Promise<Building[]> {
    return this.read(RegistrationPath.Buildings, (raw) => PublicBuildingsResponseSchema.parse(raw).buildings);
  }

  async listTowers(buildingId: string): Promise<Tower[]> {
    return this.read(buildingTowersPath(buildingId), (raw) => z.array(TowerSchema).parse(raw));
  }

  // Same endpoint as `AccessGateway.getTowerFloors`, on purpose: a failure here
  // has to speak the language of the registration, where there is no session.
  async listFloors(towerId: string): Promise<Floor[]> {
    return this.read(towerFloorsPath(towerId), (raw) => z.array(FloorSchema).parse(raw));
  }

  // An owner claims an apartment that has no leader yet, so that form asks for
  // the inactive ones (see APARTMENT_LIST_ACTIVE).
  async listApartments(input: { floorId: string; active: boolean }): Promise<Apartment[]> {
    return this.read(floorApartmentsPath(input.floorId, input.active), (raw) => z.array(ApartmentSchema).parse(raw));
  }

  // Multipart, because the photo travels with the form. The confirmation field
  // goes out too: the API declares it, even though it never compares the two.
  async register(input: RegisterApartmentUserInput): Promise<void> {
    const body = new FormData();
    body.set('name', input.name);
    body.set('cedula', input.cedula);
    body.set('documentType', input.documentType);
    body.set('email', input.email);
    body.set('phone', `${PHONE_COUNTRY_PREFIX}${input.phone}`);
    body.set('password', input.password);
    body.set('passwordConfirmation', input.password);
    body.set('apartmentId', input.apartmentId);
    body.set('photo', input.photo);

    try {
      await this.http.post({ path: registerPath(input.role, input.apartmentId), body });
    } catch (error) {
      throw toRegistrationError(error);
    }
  }

  private async read<TResult>(path: string, parse: (raw: unknown) => TResult): Promise<TResult> {
    try {
      return parse(await this.http.get({ path }));
    } catch (error) {
      throw toRegistrationError(error);
    }
  }
}
