import { createFileRoute } from '@tanstack/react-router';
import { DoorsDashboardPage } from '../../../features/doors';

// The very same screen a resident opens. Nothing here is staff only.
export const Route = createFileRoute('/admin/buildings/$buildingId/live')({
  component: DoorsDashboardPage,
});
