import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconButton, Logo, Sidebar } from '../../ui';
import { AppNavigation } from './AppNavigation';
import { AppUserCard } from './AppUserCard';
import { useSidebarCollapsed } from './useSidebarCollapsed';

type AppShellProps = {
  // Context of the current screen: title and its controls.
  header: ReactNode;
  children: ReactNode;
};

// Frame for every screen behind a session. It knows nothing about buildings:
// that context is added by the screens themselves.
export function AppShell({ header, children }: AppShellProps) {
  const sidebar = useSidebarCollapsed();

  return (
    <div className="flex h-dvh overflow-hidden bg-(--surface-base) text-(--text-primary)">
      <Sidebar
        collapsed={sidebar.collapsed}
        navLabel="Navegación principal"
        className="hidden sm:flex"
        header={<Logo size="sm" parts={sidebar.collapsed ? 'mark' : 'full'} />}
        footer={<AppUserCard collapsed={sidebar.collapsed} />}
      >
        <AppNavigation collapsed={sidebar.collapsed} />
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-none items-center gap-3 border-(--card-border) border-b px-4 sm:px-6">
          <IconButton
            label={sidebar.collapsed ? 'Expandir menú' : 'Contraer menú'}
            onClick={sidebar.toggle}
            className="hidden sm:inline-flex"
          >
            {sidebar.collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </IconButton>
          {header}
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
