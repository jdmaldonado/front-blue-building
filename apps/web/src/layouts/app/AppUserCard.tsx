import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { LogOut } from 'lucide-react';
import { useConfirm } from '../../app/ConfirmProvider';
import { endSession } from '../../app/session';
import { Avatar, IconButton } from '../../ui';

type AppUserCardProps = {
  collapsed: boolean;
};

// Who is signed in, plus the way out. The full profile menu comes later.
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
        <Avatar name={session.user.name} size="sm" />
        {signOutButton}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 px-1">
      <Avatar name={session.user.name} size="sm" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-sm font-medium">{session.user.name}</span>
        <span className="truncate text-caption text-(--text-muted)">{caption}</span>
      </div>
      <div className="ml-auto shrink-0">{signOutButton}</div>
    </div>
  );
}
