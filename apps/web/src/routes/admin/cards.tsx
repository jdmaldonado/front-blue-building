import { CardsSearchSchema } from '@bb/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CardsPage } from '../../features/cards';
import { AppShell, AppTitle } from '../../layouts/app';

// The screen can be opened from a user, from a building, or from scratch, so
// what it already knows travels in the query.
export const Route = createFileRoute('/admin/cards')({
  validateSearch: CardsSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  return (
    <AppShell header={<AppTitle title="Tarjetas" subtitle="Validación de usuarios y alta de tarjetas" />}>
      <CardsPage search={search} onSearchChange={(next) => void navigate({ to: '/admin/cards', search: next })} />
    </AppShell>
  );
}
