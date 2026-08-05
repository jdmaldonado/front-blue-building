import { LoginMode } from '@bb/core';
import { duration } from '@bb/design-tokens';
import { useSessionStore } from '@bb/logic';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, User, X, type LucideIcon } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { AppRoute } from '../../app/navigation';
import { Avatar, Drawer, Logo, Text } from '../../ui';
import { useSignOut } from '../app/useSignOut';

type ResidentMenuPanelProps = {
  open: boolean;
  onClose: () => void;
};

const optionClassName = [
  'flex min-h-12 w-full items-center justify-end gap-3 rounded-(--radius-2) px-3',
  'font-display text-body-lg font-semibold text-(--menu-panel-foreground)',
  'transition-colors duration-(--duration-fast) ease-standard hover:bg-(--menu-panel-hover)',
  'focus-visible:ring-2 focus-visible:ring-(--menu-panel-accent) focus-visible:outline-none',
].join(' ');

function OptionIcon({ icon: Icon }: { icon: LucideIcon }): ReactNode {
  return <Icon size={18} aria-hidden className="text-(--menu-panel-accent)" />;
}

// The diagonal menu of the current app, rebuilt in the brand language of the
// login panel: dark surface, honeycomb, cyan only as an accent.
export function ResidentMenuPanel({ open, onClose }: ResidentMenuPanelProps) {
  const session = useSessionStore((state) => state.session);
  const signOut = useSignOut();
  const navigate = useNavigate();

  // Changing route unmounts this panel, and an unmounted element has no way to
  // animate itself out. So the panel closes first and the route follows. The
  // link stays a link: a click with a modifier still opens a new tab.
  const goToAccount = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onClose();
    // The global CSS rule cancels the animation for whoever asked for less
    // motion, but it cannot cancel a timer: without this they would just wait.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => void navigate({ to: AppRoute.Account }), reduced ? 0 : duration.slow);
  };

  const caption =
    session === null ? null : session.mode === LoginMode.Admin ? 'Administrador' : `Documento ${session.user.cedula}`;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      label="Menú"
      side="right"
      size="full"
      className="overflow-hidden bg-transparent shadow-none"
    >
      {/* The slant is a background of its own: skewing the panel would skew
          every letter inside it. Its left border draws the diagonal line. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-[6%] w-[200%] skew-x-[-25deg] border-(--menu-panel-accent) border-l-2 bg-(--menu-panel-bg) bg-[image:var(--menu-panel-gradient),var(--pattern-honeycomb)] bg-[length:auto,39px_22.52px]"
      />

      <div className="relative ml-auto flex h-full w-[88%] max-w-[380px] flex-col gap-6 pt-6 pr-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pl-3">
        <div className="flex items-start justify-between gap-3">
          <Logo size="lg" className="text-(--menu-panel-foreground)" markClassName="text-(--menu-panel-accent)" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="-mt-2 -mr-2 flex size-11 flex-none items-center justify-center rounded-(--radius-2) text-(--menu-panel-foreground) transition-colors duration-(--duration-fast) ease-standard hover:bg-(--menu-panel-hover) focus-visible:ring-2 focus-visible:ring-(--menu-panel-accent) focus-visible:outline-none"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        {session === null ? null : (
          <div className="flex items-center justify-end gap-3 border-(--menu-panel-border) border-b pb-5">
            <span className="flex min-w-0 flex-col items-end">
              <Text as="span" size="body" weight="medium" className="text-(--menu-panel-foreground)" truncate>
                {session.user.name}
              </Text>
              <Text as="span" size="caption" className="text-(--menu-panel-muted)" truncate>
                {caption}
              </Text>
            </span>
            <Avatar name={session.user.name} size="md" />
          </div>
        )}

        {/* Pinned to the bottom: on a phone this is where the thumb already is. */}
        <nav aria-label="Menú" className="mt-auto flex flex-col items-end gap-1">
          <Link to={AppRoute.Account} onClick={goToAccount} className={optionClassName}>
            Perfil
            <OptionIcon icon={User} />
          </Link>
          <span aria-hidden className="my-1 h-px w-full bg-(--menu-panel-border)" />
          <button type="button" onClick={signOut} className={optionClassName}>
            Salir
            <OptionIcon icon={LogOut} />
          </button>
        </nav>

        <Text as="span" size="caption" className="text-right font-mono tracking-wider text-(--menu-panel-muted)">
          BLUE BUILDING
        </Text>
      </div>
    </Drawer>
  );
}
