import { DoorSchema, DoorStatusesSchema, FloorSchema, type Door, type DoorStatuses, type Floor } from '@bb/core';
import { z } from 'zod';
import type { HttpClient } from '../http';
import { AccessPath, accessibleDoorsPath, doorStatusesPath, towerFloorsPath } from './access.paths';

// The endpoint answers a bare list, but the sibling one wraps it in `doors`.
// Accept both instead of guessing.
const BuildingDoorsResponseSchema = z.union([
  z.array(DoorSchema),
  z.object({ doors: z.array(DoorSchema) }).transform((value) => value.doors),
]);

export class AccessGateway {
  constructor(private readonly http: HttpClient) {}

  async getAccessibleDoors(buildingId: string): Promise<Door[]> {
    const raw = await this.http.get({ path: accessibleDoorsPath(buildingId) });
    return z.object({ doors: z.array(DoorSchema) }).parse(raw).doors;
  }

  // Empty after an API restart: this state lives in memory. A missing door
  // means no report, not closed.
  async getDoorStatuses(buildingId: string): Promise<DoorStatuses> {
    const raw = await this.http.get({ path: doorStatusesPath(buildingId) });
    return DoorStatusesSchema.parse(raw);
  }

  // Careful: this one returns bare door rows. It joins floor and tower without
  // selecting them and never loads the cameras (DoorServiceV2.ts:12-18), so
  // `cameras` always parses to [] and `floor` to null. For cameras or floors,
  // use `getAccessibleDoors`.
  async listBuildingDoors(buildingId: string): Promise<Door[]> {
    const raw = await this.http.post({ path: AccessPath.BuildingDoors, body: { buildingId } });
    return BuildingDoorsResponseSchema.parse(raw);
  }

  async getTowerFloors(towerId: string): Promise<Floor[]> {
    const raw = await this.http.get({ path: towerFloorsPath(towerId) });
    return z.array(FloorSchema).parse(raw);
  }
}
