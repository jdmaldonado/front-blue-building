import { listApprovalPlaces, LoginMode } from '@bb/core';
import { selectCurrentSpace, selectSpaces, usePendingApprovals, useSessionStore } from '@bb/logic';
import { Building2, CreditCard, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { useMemo } from 'react';
import { AppNavigationItem } from './AppNavigationItem';

type AppNavigationProps = {
  collapsed: boolean;
  // Lets the mobile panel close itself once the user picks a destination.
  onNavigate?: () => void;
};

// Top level destinations. Sections that belong to a building live in the header
// of the building screens, not here.
export function AppNavigation({ collapsed, onNavigate }: AppNavigationProps) {
  const session = useSessionStore((state) => state.session);
  const space = useSessionStore(selectCurrentSpace);
  const spaces = useSessionStore(selectSpaces);
  const approvalPlaces = useMemo(() => listApprovalPlaces(spaces), [spaces]);
  const pending = usePendingApprovals(approvalPlaces);

  if (session === null) {
    return null;
  }

  if (session.mode === LoginMode.Admin) {
    return (
      <>
        <AppNavigationItem
          link={{ to: AppRoute.Admin }}
          icon={Building2}
          label="Edificios"
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <AppNavigationItem
          link={{ to: AppRoute.AdminUsers }}
          icon={Users}
          label="Usuarios"
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <AppNavigationItem
          link={{ to: AppRoute.AdminMonitor }}
          icon={ShieldAlert}
          label="Monitoreo"
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <AppNavigationItem
          link={{ to: AppRoute.AdminCards }}
          icon={CreditCard}
          label="Tarjetas"
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </>
    );
  }

  return (
    <>
      <AppNavigationItem
        link={{ to: AppRoute.Dashboard }}
        icon={Building2}
        label={space?.building.name ?? 'Mi edificio'}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
      {approvalPlaces.length === 0 ? null : (
        <AppNavigationItem
          link={{ to: AppRoute.AccessRequests }}
          icon={ShieldCheck}
          label="Solicitudes"
          badge={pending === 0 ? undefined : pending}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}
