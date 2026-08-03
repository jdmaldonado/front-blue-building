import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useConfirm } from '../../app/ConfirmProvider';
import { AppRoute } from '../../app/navigation';
import { endSession } from '../../app/session';
import { Avatar, IconButton, Text, sidebarItemVariants } from '../../ui';

type AppUserCardProps = {
  collapsed: boolean;
};

// Who is signed in. The name opens the profile, the button ends the session.
export function AppUserCard({ collapsed }: AppUserCardProps) {
  const session = useSessionStore((state) => state.session);
  const confirm = useConfirm();

  if (session === null) {
    return null;
  }

  const caption = session.mode === LoginMode.Admin ? 'Administrador' : `Documento ${session.user.cedula}`;

  const requestSignOut = async () => {
    const confirmed = await confirm({
      title: '¿Cerrar sesión?',
      description: 'Tendrás que ingresar tu documento y contraseña para volver a entrar.',
      confirmLabel: 'Cerrar sesión',
      intent: 'destructive',
    });
    if (confirmed) {
      endSession();
    }
  };

  const signOutButton = (
    <IconButton label="Cerrar sesión" onClick={() => void requestSignOut()}>
      <LogOut size={18} />
    </IconButton>
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
          <Avatar name={session.user.name} size="sm" />
          <span className="sr-only">Perfil</span>
        </Link>
        {signOutButton}
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
        <Avatar name={session.user.name} size="sm" />
        <span className="flex min-w-0 flex-col">
          <Text as="span" size="body-sm" weight="medium" truncate>
            {session.user.name}
          </Text>
          <Text as="span" size="caption" tone="muted" truncate>
            {caption}
          </Text>
        </span>
      </Link>
      {signOutButton}
    </div>
  );
}
