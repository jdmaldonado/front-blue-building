import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { createFileRoute } from '@tanstack/react-router';
import { useSessionBuilding } from '../app/BuildingContext';
import { requireSession } from '../app/guards';
import { AccountPage } from '../features/account';
import { AppShell, AppTitle } from '../layouts/app';
import { ResidentMobileNav } from '../layouts/resident';

export const Route = createFileRoute('/account')({
  beforeLoad: requireSession,
  component: RouteComponent,
});

function RouteComponent() {
  const mode = useSessionStore((state) => state.session?.mode ?? null);
  const building = useSessionBuilding();
  // The profile is where the resident menu leads, so the bar has to stay there
  // too. Staff keeps the default navigation.
  const isResident = mode === LoginMode.Usuario && building !== null;

  return (
    <AppShell
      header={<AppTitle title="Perfil" subtitle="Tus datos y tu sesión" />}
      mobileNav={isResident ? <ResidentMobileNav buildingId={building.id} /> : undefined}
    >
      <AccountPage />
    </AppShell>
  );
}
