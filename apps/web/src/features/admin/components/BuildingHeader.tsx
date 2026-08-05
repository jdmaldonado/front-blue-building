import type { Building } from '@bb/core';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { Text, Tooltip, iconButtonVariants } from '../../../ui';
import { BuildingActions } from './BuildingActions';
import { BuildingStatusBadge } from './BuildingStatusBadge';

type BuildingHeaderProps = {
  building: Building;
};

// Title, state and actions of the building the staff is looking at. Lives here
// and not in `layouts/` because it knows what a building is.
export function BuildingHeader({ building }: BuildingHeaderProps) {
  return (
    <>
      {/* Same reason as in the apartments table: no button inside an anchor. */}
      <Tooltip content="Volver a edificios" decorative>
        <Link to={AppRoute.Admin} aria-label="Volver a edificios" className={iconButtonVariants()}>
          <ArrowLeft size={18} />
        </Link>
      </Tooltip>

      <div className="flex min-w-0 flex-col">
        <Text as="h1" size="title-sm" weight="bold" truncate>
          {building.name}
        </Text>
        <Text as="span" size="caption" tone="muted" truncate>
          {building.city ?? 'Edificio'}
        </Text>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden sm:inline-flex">
          <BuildingStatusBadge building={building} />
        </span>
        <BuildingActions building={building} />
      </div>
    </>
  );
}
