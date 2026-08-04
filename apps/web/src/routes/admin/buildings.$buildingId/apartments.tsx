import { createFileRoute } from '@tanstack/react-router';
import { BuildingApartmentsPage } from '../../../features/admin';

export const Route = createFileRoute('/admin/buildings/$buildingId/apartments')({
  component: BuildingApartmentsPage,
});
