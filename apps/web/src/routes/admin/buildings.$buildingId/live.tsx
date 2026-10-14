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
  const search = Route.useSearch();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Only when the monitor sent us here, and back to all of it: while one
          event is handled, new ones can arrive from any building. */}
      {search.from === LiveOrigin.Monitor ? (
        <Link
          to={AppRoute.AdminMonitor}
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
