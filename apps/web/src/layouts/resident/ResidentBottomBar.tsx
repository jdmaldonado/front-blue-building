import { Link } from '@tanstack/react-router';
import { House, Menu, Siren } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { cn } from '../../ui';

type ResidentBottomBarProps = {
  onOpenEvents: () => void;
  onOpenMenu: () => void;
};

const itemClassName = [
  'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-(--radius-2)',
  'transition-colors duration-(--duration-fast) ease-standard',
  'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
].join(' ');

// Bottom bar of the resident, at every width, like the one the current app
// has: home, the alert button and the menu. Everything else lives inside those.
export function ResidentBottomBar({ onOpenEvents, onOpenMenu }: ResidentBottomBarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="flex flex-none items-center gap-1 border-(--menu-border) border-t bg-(--menu-bg) px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      {/* The active colour goes through `cn` and not `activeProps`: the router
          concatenates classes without merging, so two text colours would fight
          and the winner would depend on Tailwind's own order. */}
      <Link to={AppRoute.Dashboard} className="flex flex-1">
        {({ isActive }: { isActive: boolean }) => (
          <span className={cn(itemClassName, isActive ? 'text-(--accent)' : 'text-(--text-secondary)')}>
            {/* Sits on the top edge of the bar, over its border. */}
            <span
              aria-hidden
              className={cn(
                '-top-2 absolute h-0.5 w-10 bg-(--accent) transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
            <House size={28} aria-hidden />
            <span className="text-caption">Inicio</span>
          </span>
        )}
      </Link>

      <button type="button" onClick={onOpenEvents} className={cn(itemClassName, 'text-(--destructive)')}>
        <Siren size={28} aria-hidden />
        <span className="text-caption">Alerta</span>
      </button>

      <button type="button" onClick={onOpenMenu} className={itemClassName}>
        <Menu size={28} aria-hidden />
        <span className="text-caption">Menú</span>
      </button>
    </nav>
  );
}
