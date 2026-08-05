import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Drawer, IconButton, Logo, Sidebar, cn } from '../../ui';
import { AppNavigation } from './AppNavigation';
import { AppUserCard } from './AppUserCard';
import { useSidebarCollapsed } from './useSidebarCollapsed';

type AppShellProps = {
  // Context of the current screen: title and its controls.
  header: ReactNode;
  // Pinned to the right of the header, for actions that must stay reachable.
  headerActions?: ReactNode;
  // Links of the section the screen belongs to, under the main navigation. It
  // is a function because only the shell knows if the sidebar is collapsed.
  sectionNav?: (state: { collapsed: boolean; onNavigate?: () => void }) => ReactNode;
  // Replaces the whole mobile navigation: no hamburger, no side panel, and the
  // header actions move into it. Desktop is untouched.
  mobileNav?: ReactNode;
  children: ReactNode;
};

// Frame for every screen behind a session. It knows nothing about buildings:
// that context is added by the screens themselves.
export function AppShell({ header, headerActions, sectionNav, mobileNav, children }: AppShellProps) {
  const sidebar = useSidebarCollapsed();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
        {sectionNav === undefined ? null : (
          <>
            <span className="my-1 h-px w-full flex-none bg-(--menu-border)" />
            {sectionNav({ collapsed: sidebar.collapsed })}
          </>
        )}
      </Sidebar>

      {/* Same sidebar, in a panel, because it does not fit next to the content
          on a phone. */}
      {mobileNav === undefined ? (
        <Drawer open={menuOpen} onClose={closeMenu} label="Menú" className="sm:hidden">
          <Sidebar
            navLabel="Navegación principal"
            className="h-full w-full border-r-0"
            header={<Logo size="sm" />}
            footer={<AppUserCard collapsed={false} />}
          >
            <AppNavigation collapsed={false} onNavigate={closeMenu} />
            {sectionNav === undefined ? null : (
              <>
                <span className="my-1 h-px w-full flex-none bg-(--menu-border)" />
                {sectionNav({ collapsed: false, onNavigate: closeMenu })}
              </>
            )}
          </Sidebar>
        </Drawer>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-none items-center gap-3 border-(--card-border) border-b px-4 sm:px-6">
          {mobileNav === undefined ? (
            <IconButton label="Abrir menú" onClick={() => setMenuOpen(true)} className="sm:hidden">
              <Menu size={18} />
            </IconButton>
          ) : null}
          <IconButton
            label={sidebar.collapsed ? 'Expandir menú' : 'Contraer menú'}
            onClick={sidebar.toggle}
            className="hidden sm:inline-flex"
          >
            {sidebar.collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </IconButton>
          {header}
          {headerActions === undefined ? null : (
            <div className={cn('ml-auto flex items-center gap-2', mobileNav === undefined ? '' : 'hidden sm:flex')}>
              {headerActions}
            </div>
          )}
        </header>

        <main
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6',
            // Room for the fixed bottom bar, which floats over the content.
            mobileNav === undefined ? '' : 'pb-20 sm:pb-6',
          )}
        >
          {children}
        </main>
      </div>

      {mobileNav}
    </div>
  );
}
