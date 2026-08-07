import { MonitorSearchSchema } from '@bb/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MonitorPage } from '../../../features/monitor';

// Same screen, with the building already fixed.
export const Route = createFileRoute('/admin/buildings/$buildingId/events')({
  validateSearch: MonitorSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { buildingId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  return (
    <MonitorPage
      search={search}
      lockedBuildingId={buildingId}
      onSearchChange={(next) =>
        void navigate({ to: '/admin/buildings/$buildingId/events', params: { buildingId }, search: next })
      }
    />
  );
}
