import { Link } from '@tanstack/react-router';
import { House, Menu, Siren } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { cn } from '../../ui';

type ResidentBottomBarProps = {
  onOpenEvents: () => void;
  onOpenMenu: () => void;
};

const itemClassName = [
  'relative flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-(--radius-2)',
  'text-(--text-secondary) transition-colors duration-(--duration-fast) ease-standard',
  'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
].join(' ');

// Fixed bar of the resident on a phone, like the one the current app has:
// home, the alert button and the menu. Everything else lives inside those.
export function ResidentBottomBar({ onOpenEvents, onOpenMenu }: ResidentBottomBarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-1 border-(--menu-border) border-t bg-(--menu-bg) px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] sm:hidden"
    >
      <Link to={AppRoute.Dashboard} className={itemClassName} activeProps={{ className: 'text-(--accent)' }}>
        {({ isActive }: { isActive: boolean }) => (
          <>
            <span
              aria-hidden
              className={cn(
                'absolute top-0 h-0.5 w-9 rounded-(--radius-round) bg-(--accent) transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
            <House size={22} aria-hidden />
            <span className="text-caption">Inicio</span>
          </>
        )}
      </Link>

      <button type="button" onClick={onOpenEvents} className={cn(itemClassName, 'text-(--destructive)')}>
        <Siren size={22} aria-hidden />
        <span className="text-caption">Alerta</span>
      </button>

      <button type="button" onClick={onOpenMenu} className={itemClassName}>
        <Menu size={22} aria-hidden />
        <span className="text-caption">Menú</span>
      </button>
    </nav>
  );
}
