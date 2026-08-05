import { useSessionStore } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { Drawer, Logo, Text } from '../../ui';
import { useSignOut } from '../app/useSignOut';

type ResidentMenuPanelProps = {
  open: boolean;
  onClose: () => void;
};

const optionClassName = [
  'flex min-h-11 items-center justify-end rounded-(--radius-2) px-2',
  'font-display text-title-sm font-bold',
  'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
].join(' ');

// The diagonal menu of the current app, rebuilt. Full screen, brand gradient,
// options pinned to the right.
export function ResidentMenuPanel({ open, onClose }: ResidentMenuPanelProps) {
  const session = useSessionStore((state) => state.session);
  const signOut = useSignOut();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      label="Menú"
      side="right"
      size="full"
      className="overflow-hidden bg-transparent shadow-none"
    >
      {/* The slant is a background of its own. Skewing the panel would skew
          every letter inside it. */}
      <span
        aria-hidden
        className="absolute inset-y-0 -left-1/4 w-[200%] skew-x-[-25deg] bg-[image:var(--menu-panel-gradient)]"
      />

      <div className="relative flex h-full flex-col justify-between p-6 text-(--menu-panel-foreground)">
        <div className="flex items-start justify-between">
          <Logo size="sm" className="text-(--menu-panel-foreground)" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="-mr-2 flex size-11 items-center justify-center rounded-(--radius-2) focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none"
          >
            <X size={24} aria-hidden />
          </button>
        </div>

        <nav aria-label="Menú" className="flex flex-col items-end gap-2">
          <Link to={AppRoute.Account} onClick={onClose} className={optionClassName}>
            Perfil
          </Link>
          <button type="button" onClick={signOut} className={optionClassName}>
            Salir
          </button>
        </nav>

        {session === null ? null : (
          <Text as="span" size="caption" className="text-right">
            {session.user.name}
          </Text>
        )}
      </div>
    </Drawer>
  );
}
