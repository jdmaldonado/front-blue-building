import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { LogOut, Moon, Sun } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { Theme, useTheme } from '../../app/theme';
import { Avatar, IconButton, Text, sidebarItemVariants } from '../../ui';
import { useSignOut } from './useSignOut';

type AppUserCardProps = {
  collapsed: boolean;
};

// Who is signed in. The name opens the profile; the buttons switch the theme
// and end the session.
export function AppUserCard({ collapsed }: AppUserCardProps) {
  const session = useSessionStore((state) => state.session);
  const signOut = useSignOut();
  const theme = useTheme();

  if (session === null) {
    return null;
  }

  const caption = session.mode === LoginMode.Admin ? 'Administrador' : `Documento ${session.user.cedula}`;

  const isDark = theme.theme === Theme.Dark;
  const buttons = (
    <>
      <IconButton label={isDark ? 'Modo claro' : 'Modo oscuro'} onClick={theme.toggle}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>
      <IconButton label="Cerrar sesión" onClick={signOut}>
        <LogOut size={18} />
      </IconButton>
    </>
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Link
          to={AppRoute.Account}
          title="Perfil"
          activeProps={{ className: sidebarItemVariants({ collapsed: true, selected: true }) }}
          inactiveProps={{ className: sidebarItemVariants({ collapsed: true, selected: false }) }}
        >
          <Avatar src={session.user.photo} name={session.user.name} size="sm" />
          <span className="sr-only">Perfil</span>
        </Link>
        {buttons}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        to={AppRoute.Account}
        className="min-w-0 flex-1"
        activeProps={{ className: sidebarItemVariants({ selected: true }) }}
        inactiveProps={{ className: sidebarItemVariants({ selected: false }) }}
      >
        <Avatar src={session.user.photo} name={session.user.name} size="sm" />
        <span className="flex min-w-0 flex-col">
          <Text as="span" size="body-sm" weight="medium" truncate>
            {session.user.name}
          </Text>
          <Text as="span" size="caption" tone="muted" truncate>
            {caption}
          </Text>
        </span>
      </Link>
      {buttons}
    </div>
  );
}
