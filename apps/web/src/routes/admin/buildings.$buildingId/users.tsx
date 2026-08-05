import { createFileRoute } from '@tanstack/react-router';
import { BuildingResidentsPage } from '../../../features/users';

export const Route = createFileRoute('/admin/buildings/$buildingId/users')({
  component: BuildingResidentsPage,
});
