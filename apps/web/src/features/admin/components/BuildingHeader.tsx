import type { Building } from '@bb/core';
import { BuildingActions } from './BuildingActions';
import { BuildingBreadcrumb } from './BuildingBreadcrumb';
import { BuildingStatusBadge } from './BuildingStatusBadge';

type BuildingHeaderProps = {
  building: Building;
};

// Where the staff is and what they can do about it. Lives here and not in
// `layouts/` because it knows what a building is.
export function BuildingHeader({ building }: BuildingHeaderProps) {
  return (
    <>
      <BuildingBreadcrumb building={building} />

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden sm:inline-flex">
          <BuildingStatusBadge building={building} />
        </span>
        <BuildingActions building={building} />
      </div>
    </>
  );
}
