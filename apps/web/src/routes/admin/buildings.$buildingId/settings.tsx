import { createFileRoute } from '@tanstack/react-router';
import { BuildingSettingsPage } from '../../../features/admin';

export const Route = createFileRoute('/admin/buildings/$buildingId/settings')({
  component: BuildingSettingsPage,
});
