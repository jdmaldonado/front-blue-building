import { createFileRoute } from '@tanstack/react-router';
import { AdminBuildingsPage } from '../../features/admin';

export const Route = createFileRoute('/admin/')({
  component: AdminBuildingsPage,
});
