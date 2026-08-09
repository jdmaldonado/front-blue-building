import { ApartmentSchema, BuildingSchema, type Apartment, type Building, type MaintenanceInput } from '@bb/core';
import { z } from 'zod';
import type { HttpClient } from '../http';
import { toBuildingsError } from './buildings.errors';
import { BuildingsPath, buildingApartmentsPath, maintenancePath } from './buildings.paths';

export interface RetireApartmentInput {
  buildingId: string;
  apartmentId: string;
}

export class BuildingsGateway {
  constructor(private readonly http: HttpClient) {}

  // This route answers the array directly, without a `buildings` wrapper. The
  // public one used by the registration does wrap it.
  async listBuildings(): Promise<Building[]> {
    try {
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
      const raw = await this.http.get({ path: buildingApartmentsPath(buildingId) });
      return z.array(ApartmentSchema).parse(raw);
    } catch (error) {
      throw toBuildingsError(error);
    }
  }

  // Named after what it does, not after the HTTP verb: it deletes the cards,
  // marks the residents as EX_RESIDENTE and leaves an empty apartment behind
  // (api/src/2.0/apartaments/controllers/ApartmentControllerV2.ts:9).
  async retireApartment(input: RetireApartmentInput): Promise<void> {
    try {
      await this.http.delete({ path: `${buildingApartmentsPath(input.buildingId)}/${input.apartmentId}` });
    } catch (error) {
      throw toBuildingsError(error);
    }
  }
}
