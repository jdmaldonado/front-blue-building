import { UserEvent } from '@bb/core';
import { useUserEvents } from '@bb/logic';
import { BellOff, TriangleAlert, Users } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Alert, Button, Dialog, cn } from '../../../ui';

// Shared on purpose: these actions appear in several screens, so the rule about
// which ones need confirmation lives only here.

type ConfirmSpec = {
  title: string;
  description: string;
  cta: string;
  intent: 'destructive' | 'warning';
};

const CONFIRM: Partial<Record<UserEvent, ConfirmSpec>> = {
  [UserEvent.Emergency]: {
    title: '¿Confirmar emergencia?',
    description: 'Se dispara la alarma del edificio y se notifica al staff. Queda registrado a tu nombre.',
    cta: 'Disparar',
    intent: 'destructive',
  },
  [UserEvent.Mute]: {
    title: '¿Silenciar la alarma?',
    description: 'Se silencia la alarma en todo el edificio. La acción queda registrada.',
    cta: 'Silenciar',
    intent: 'warning',
  },
};

const SENT_MESSAGE: Record<UserEvent, string> = {
  [UserEvent.Intrusion]: 'Alerta de intrusión enviada.',
  [UserEvent.Emergency]: 'Emergencia reportada, alarma activada.',
  [UserEvent.Mute]: 'Alarma silenciada en el edificio.',
};

type UserEventActionsProps = {
  buildingId: string;
  className?: string;
};

export function UserEventActions({ buildingId, className }: UserEventActionsProps) {
  const [pending, setPending] = useState<UserEvent | null>(null);
  const [feedback, setFeedback] = useState<ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { sendUserEvent } = useUserEvents(buildingId, {
    onError: () => setError('El servidor rechazó la acción. Revisa tus permisos e intenta de nuevo.'),
  });

  const emit = (event: UserEvent) => {
    setError(null);
    sendUserEvent(event);
    setFeedback(SENT_MESSAGE[event]);
  };

  const request = (event: UserEvent) => {
    if (CONFIRM[event] === undefined) {
      emit(event);
      return;
    }
    setPending(event);
  };

  const confirm = pending === null ? undefined : CONFIRM[pending];

  return (
    <>
      <div className={cn('flex flex-wrap gap-2', className)}>
        <Button intent="warning" appearance="outline" onClick={() => request(UserEvent.Intrusion)}>
          <Users size={17} />
          Intruso
        </Button>
        <Button intent="destructive" onClick={() => request(UserEvent.Emergency)}>
          <TriangleAlert size={17} />
          Emergencia
        </Button>
        <Button intent="neutral" appearance="outline" onClick={() => request(UserEvent.Mute)}>
          <BellOff size={17} />
          Silenciar
        </Button>
      </div>

      {error !== null ? (
        <Alert variant="error" title="No pudimos enviar el evento">
          {error}
        </Alert>
      ) : feedback !== null ? (
        <Alert variant="success" title="Listo">
          {feedback}
        </Alert>
      ) : null}

      <Dialog
        open={confirm !== undefined}
        onClose={() => setPending(null)}
        size="sm"
        title={confirm?.title ?? ''}
        footer={
          <>
            <Button intent="neutral" appearance="outline" onClick={() => setPending(null)}>
              Cancelar
            </Button>
            <Button
              intent={confirm?.intent ?? 'destructive'}
              onClick={() => {
                if (pending !== null) {
                  emit(pending);
                }
                setPending(null);
              }}
            >
              {confirm?.cta ?? 'Confirmar'}
            </Button>
          </>
        }
      >
        <p className="text-body text-(--text-secondary)">{confirm?.description}</p>
      </Dialog>
    </>
  );
}
