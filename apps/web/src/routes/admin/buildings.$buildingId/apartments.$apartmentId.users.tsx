import { createFileRoute } from '@tanstack/react-router';
import { ApartmentResidentsPage } from '../../../features/users';

export const Route = createFileRoute('/admin/buildings/$buildingId/apartments/$apartmentId/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const { apartmentId } = Route.useParams();
  return <ApartmentResidentsPage apartmentId={apartmentId} />;
}
