import { createFileRoute } from '@tanstack/react-router';
import { useBuilding } from '../../../app/BuildingContext';
import { BuildingSummaryPage } from '../../../features/admin';

export const Route = createFileRoute('/admin/buildings/$buildingId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const building = useBuilding();
  return <BuildingSummaryPage building={building} />;
}
