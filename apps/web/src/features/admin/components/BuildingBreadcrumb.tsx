import type { Building } from '@bb/core';
import { useApartments } from '@bb/logic';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { Breadcrumb, breadcrumbItemVariants, breadcrumbLinkVariants, breadcrumbSeparatorVariants } from '../../../ui';
import { BUILDING_SECTIONS, buildingSectionPath } from '../lib';

type BuildingBreadcrumbProps = {
  building: Building;
};

type Crumb = {
  label: string;
  to: AppRoute;
  params: Record<string, string>;
};

// Where the staff is inside the building, and how to step back out. The last
// step is the page title, so it is not repeated here.
export function BuildingBreadcrumb({ building }: BuildingBreadcrumbProps) {
  const { pathname } = useLocation();
  const params = useParams({ strict: false });
  const apartmentId = params.apartmentId;

  // Cached already when arriving from the apartments list, which is the only
  // way to reach this screen.
  const apartments = useApartments(apartmentId === undefined ? null : building.id);
  const apartmentName =
    apartmentId === undefined
      ? null
      : (apartments.data?.find((apartment) => apartment.id === apartmentId)?.name ?? apartmentId);

  const section = BUILDING_SECTIONS.filter((candidate) =>
    pathname.startsWith(buildingSectionPath(candidate.to, building.id)),
  ).at(-1);

  const crumbs: Crumb[] = [{ label: 'Edificios', to: AppRoute.Admin, params: {} }];

  if (section !== undefined) {
    crumbs.push({ label: building.name, to: AppRoute.AdminBuilding, params: { buildingId: building.id } });
  }

  // Inside an apartment the section itself becomes a step back.
  if (section !== undefined && apartmentName !== null) {
    crumbs.push({ label: section.label, to: section.to, params: { buildingId: building.id } });
  }

  const title = apartmentName ?? section?.label ?? building.name;
  const parent = crumbs.at(-1);

  return (
    <div className="flex min-w-0 flex-col">
      {/* Desktop: the whole trail. */}
      <Breadcrumb label="Ruta de navegación" className="hidden sm:block">
        {crumbs.map((crumb, index) => (
          <li key={crumb.to} className={breadcrumbItemVariants()}>
            {index === 0 ? null : <ChevronRight size={12} aria-hidden className={breadcrumbSeparatorVariants()} />}
            <Link to={crumb.to} params={crumb.params} className={breadcrumbLinkVariants()}>
              {crumb.label}
            </Link>
          </li>
        ))}
      </Breadcrumb>

      {/* Phone: only the step back, which is what the trail is for here. */}
      {parent === undefined ? null : (
        <Breadcrumb label="Volver" className="sm:hidden">
          <li className={breadcrumbItemVariants()}>
            <Link to={parent.to} params={parent.params} className={breadcrumbLinkVariants()}>
              <ChevronLeft size={12} aria-hidden className={breadcrumbSeparatorVariants()} />
              {parent.label}
            </Link>
          </li>
        </Breadcrumb>
      )}

      <h1 className="truncate font-display text-title-sm font-bold tracking-tight">{title}</h1>
    </div>
  );
}
