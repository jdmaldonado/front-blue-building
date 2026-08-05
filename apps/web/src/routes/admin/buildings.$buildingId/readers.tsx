import { createFileRoute } from '@tanstack/react-router';
import { ReadersPage } from '../../../features/readers';

export const Route = createFileRoute('/admin/buildings/$buildingId/readers')({
  component: ReadersPage,
});
