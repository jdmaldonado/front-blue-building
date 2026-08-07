import { LiveOrigin, LiveSearchSchema } from '@bb/core';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { DoorsDashboardPage } from '../../../features/doors';
import { buttonVariants } from '../../../ui';

// The very same screen a resident opens. Nothing here is staff only.
export const Route = createFileRoute('/admin/buildings/$buildingId/live')({
  validateSearch: LiveSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { buildingId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Only when the monitor sent us here. Reached any other way, the
          breadcrumb is the way out. */}
      {search.from === LiveOrigin.Monitor ? (
        <Link
          to={AppRoute.AdminBuildingEvents}
          params={{ buildingId }}
          className={buttonVariants({ intent: 'neutral', appearance: 'ghost', size: 'sm', className: 'self-start' })}
        >
          <ArrowLeft size={16} />
          Volver a eventos
        </Link>
      ) : null}

      <DoorsDashboardPage initialDoorName={search.doorName} />
    </div>
  );
}
