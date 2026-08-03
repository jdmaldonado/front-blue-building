import { LoginMode } from '@bb/core';
import { selectCurrentSpace, useSessionStore } from '@bb/logic';
import { Building2 } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { AppNavigationItem } from './AppNavigationItem';

type AppNavigationProps = {
  collapsed: boolean;
};

// Top level destinations. Sections that belong to a building live in the header
// of the building screens, not here.
export function AppNavigation({ collapsed }: AppNavigationProps) {
  const session = useSessionStore((state) => state.session);
  const space = useSessionStore(selectCurrentSpace);

  if (session === null) {
    return null;
  }

  if (session.mode === LoginMode.Admin) {
    return <AppNavigationItem link={{ to: AppRoute.Admin }} icon={Building2} label="Edificios" collapsed={collapsed} />;
  }

  return (
    <AppNavigationItem
      link={{ to: AppRoute.Dashboard }}
      icon={Building2}
      label={space?.building.name ?? 'Mi edificio'}
      collapsed={collapsed}
    />
  );
}
