import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { LogOut } from 'lucide-react';
import { endSession } from '../../app/session';
import { Avatar, IconButton } from '../../ui';

type AppUserCardProps = {
  collapsed: boolean;
};

// Who is signed in, plus the way out. The full profile menu comes later.
export function AppUserCard({ collapsed }: AppUserCardProps) {
  const session = useSessionStore((state) => state.session);

  if (session === null) {
    return null;
  }

  const caption = session.mode === LoginMode.Admin ? 'Administrador' : `Documento ${session.user.cedula}`;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Avatar name={session.user.name} size="sm" />
        <IconButton label="Cerrar sesión" onClick={endSession}>
          <LogOut size={18} />
        </IconButton>
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
      <IconButton label="Cerrar sesión" onClick={endSession} className="ml-auto shrink-0">
        <LogOut size={18} />
      </IconButton>
    </div>
  );
}
