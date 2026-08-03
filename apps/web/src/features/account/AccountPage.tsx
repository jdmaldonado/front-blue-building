import { LoginMode, type Space } from '@bb/core';
import { selectSpaces, useSessionStore } from '@bb/logic';
import { Building2, DoorClosed, IdCard, LogOut, Mail, Phone, UserRound } from 'lucide-react';
import { useConfirm } from '../../app/ConfirmProvider';
import { endSession } from '../../app/session';
import { Alert, Avatar, Button, Card, Text } from '../../ui';
import { AccountField } from './components/AccountField';
import { ROLE_LABEL, USER_TYPE_LABEL } from './lib';

export function AccountPage() {
  const session = useSessionStore((state) => state.session);
  const spaces = useSessionStore(selectSpaces);
  const selectedSpaceIndex = useSessionStore((state) => state.selectedSpaceIndex);
  const confirm = useConfirm();

  if (session === null) {
    return (
      <Alert variant="warning" title="Sin sesión">
        Vuelve a ingresar para ver tu perfil.
      </Alert>
    );
  }

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

  const caption =
    session.mode === LoginMode.Admin
      ? USER_TYPE_LABEL[session.user.userType]
      : (spaceRole(spaces[selectedSpaceIndex]) ?? 'Residente');

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Card className="flex items-center gap-4">
        <Avatar name={session.user.name} size="lg" />
        <div className="flex min-w-0 flex-col">
          <Text as="h2" size="title-sm" weight="bold" truncate>
            {session.user.name}
          </Text>
          <Text as="span" size="body-sm" tone="muted">
            {caption}
          </Text>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <Text as="h3" size="label" tone="muted" weight="semibold">
          DATOS DE CONTACTO
        </Text>
        <AccountField icon={IdCard} label="Documento" value={session.user.cedula} />
        <AccountField icon={Mail} label="Correo" value={session.user.email} />
        {session.mode === LoginMode.Usuario ? (
          <AccountField icon={Phone} label="Teléfono" value={session.user.phone} />
        ) : null}
      </Card>

      {spaces.map((space, index) => (
        <Card key={`${space.building.id}-${space.apartment?.id ?? index}`} className="flex flex-col gap-4">
          <Text as="h3" size="label" tone="muted" weight="semibold">
            {spaces.length > 1 ? `ESPACIO ${index + 1}` : 'MI ESPACIO'}
          </Text>
          <AccountField icon={Building2} label="Edificio" value={space.building.name} />
          <AccountField icon={DoorClosed} label="Apartamento" value={space.apartment?.name} />
          <AccountField icon={UserRound} label="Rol" value={spaceRole(space)} />
        </Card>
      ))}

      <Button intent="destructive" appearance="outline" onClick={() => void requestSignOut()} className="self-start">
        <LogOut size={18} />
        Cerrar sesión
      </Button>
    </div>
  );
}

function spaceRole(space: Space | undefined): string | null {
  if (space === undefined) {
    return null;
  }
  return ROLE_LABEL[space.role.name];
}
