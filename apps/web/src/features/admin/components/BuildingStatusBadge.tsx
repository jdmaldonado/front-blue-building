import { isBuildingInMaintenance, type Building } from '@bb/core';
import { Badge } from '../../../ui';
import { maintenanceRemaining } from '../lib';

type BuildingStatusBadgeProps = {
  building: Building;
};

// The API tells us nothing about the hardware yet, so the only state a building
// has today is whether its notifications are muted.
export function BuildingStatusBadge({ building }: BuildingStatusBadgeProps) {
  const endsAt = building.maintenanceModeEndsAt;

  if (!isBuildingInMaintenance(building) || endsAt === null || endsAt === undefined) {
    return (
      <Badge tone="success" size="sm" dot>
        Activo
      </Badge>
    );
  }

  return (
    <Badge tone="warning" size="sm" dot>
      Mantenimiento · {maintenanceRemaining(endsAt)}
    </Badge>
  );
}
