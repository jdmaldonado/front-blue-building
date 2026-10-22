import { listApprovalPlaces, LoginMode } from '@bb/core';
import { duration } from '@bb/design-tokens';
import { selectSpaces, usePendingApprovals, useSessionStore } from '@bb/logic';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, Moon, ShieldCheck, Sun, User, X, type LucideIcon } from 'lucide-react';
import { useMemo, type MouseEvent, type ReactNode } from 'react';
import { AppRoute } from '../../app/navigation';
import { Theme, useTheme } from '../../app/theme';
import { Avatar, Badge, Drawer, Logo, Text, textVariants } from '../../ui';
import { useSignOut } from '../app/useSignOut';

type ResidentMenuPanelProps = {
  open: boolean;
  onClose: () => void;
};

const optionClassName = [
  'flex min-h-12 w-full items-center justify-end gap-3 rounded-(--radius-2) px-3',
  textVariants({ size: 'subtitle', weight: 'semibold', tone: 'inherit' }),
  'font-display text-(--brand-vivid-foreground)',
  'transition-colors duration-(--duration-fast) ease-standard hover:bg-(--brand-vivid-ring)',
  'focus-visible:ring-2 focus-visible:ring-(--brand-vivid-foreground) focus-visible:outline-none',
].join(' ');

function OptionIcon({ icon: Icon }: { icon: LucideIcon }): ReactNode {
  return <Icon size={18} aria-hidden className="text-(--brand-vivid-foreground)" />;
}

// The diagonal menu of the current app, on the same gradient as the login and
// rising from the bottom bar that opens it.
export function ResidentMenuPanel({ open, onClose }: ResidentMenuPanelProps) {
  const session = useSessionStore((state) => state.session);
  const spaces = useSessionStore(selectSpaces);
  const approvalPlaces = useMemo(() => listApprovalPlaces(spaces), [spaces]);
  const pending = usePendingApprovals(approvalPlaces);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.theme === Theme.Dark;

  // Changing route unmounts this panel, and an unmounted element has no way to
  // animate itself out. So the panel closes first and the route follows. The
  // link stays a link: a click with a modifier still opens a new tab.
  const closeThenGo = (to: AppRoute) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onClose();
    // The global CSS rule cancels the animation for whoever asked for less
    // motion, but it cannot cancel a timer: without this they would just wait.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => void navigate({ to }), reduced ? 0 : duration.base);
  };

  const caption =
    session === null ? null : session.mode === LoginMode.Admin ? 'Administrador' : `Documento ${session.user.cedula}`;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      label="Menú"
      side="bottom"
      size="full"
      className="on-brand-vivid overflow-hidden bg-transparent shadow-none"
    >
      {/* The slant is a background of its own: skewing the panel would skew
          every letter inside it. Its left border draws the diagonal line. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-[6%] w-[200%] skew-x-(--slant) border-(--brand-vivid-foreground) border-l-2 bg-[image:var(--brand-vivid-surface)]"
      />

      <div className="relative ml-auto flex h-full w-[88%] max-w-[380px] flex-col gap-6 pt-6 pr-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pl-3">
        <div className="flex items-start justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="-mt-2 -mr-2 flex size-11 flex-none items-center justify-center rounded-(--radius-2) text-(--brand-vivid-foreground) transition-colors duration-(--duration-fast) ease-standard hover:bg-(--brand-vivid-ring) focus-visible:ring-2 focus-visible:ring-(--brand-vivid-foreground) focus-visible:outline-none"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        {session === null ? null : (
          <div className="ml-auto flex w-fit items-center gap-3 border-(--brand-vivid-border) border-b pb-4">
            {/* Narrow and wrapping: up here the diagonal leaves little room, and a
                long name on one line runs across it. */}
            <span className="flex max-w-32 min-w-0 flex-col items-end text-right">
              <Text as="span" size="subtitle" weight="semibold" className="text-(--brand-vivid-foreground)">
                {session.user.name}
              </Text>
              <Text as="span" size="body-sm" className="text-(--brand-vivid-muted)">
                {caption}
              </Text>
            </span>
            <Avatar src={session.user.photo} name={session.user.name} size="md" />
          </div>
        )}

        {/* Pinned to the bottom: on a phone this is where the thumb already is. */}
        <nav aria-label="Menú" className="mt-auto flex flex-col items-end gap-1">
          {approvalPlaces.length === 0 ? null : (
            <Link
              to={AppRoute.AccessRequests}
              onClick={closeThenGo(AppRoute.AccessRequests)}
              className={optionClassName}
            >
              Solicitudes
              {pending === 0 ? null : <Badge tone="accent">{pending}</Badge>}
              <OptionIcon icon={ShieldCheck} />
            </Link>
          )}
          <Link to={AppRoute.Account} onClick={closeThenGo(AppRoute.Account)} className={optionClassName}>
            Perfil
            <OptionIcon icon={User} />
          </Link>
          {/* Says where it goes, not where it is. */}
          <button type="button" onClick={theme.toggle} className={optionClassName}>
            {isDark ? 'Modo claro' : 'Modo oscuro'}
            <OptionIcon icon={isDark ? Sun : Moon} />
          </button>
          <span aria-hidden className="my-1 h-px w-full bg-(--brand-vivid-border)" />
          <button type="button" onClick={signOut} className={optionClassName}>
            Salir
            <OptionIcon icon={LogOut} />
          </button>
        </nav>

        <Logo size="lg" parts="wordmark" className="justify-end text-(--brand-vivid-foreground)" />
      </div>
    </Drawer>
  );
}
