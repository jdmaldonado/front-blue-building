import { UserEvent } from '@bb/core';

export type ConfirmSpec = {
  title: string;
  description: string;
  cta: string;
  intent: 'destructive' | 'warning';
};

// Only the events with a building-wide effect ask for confirmation. Reporting an
// intruder is cheap to undo, so it goes straight through.
export const USER_EVENT_CONFIRM: Partial<Record<UserEvent, ConfirmSpec>> = {
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

export const USER_EVENT_SENT_MESSAGE: Record<UserEvent, string> = {
  [UserEvent.Intrusion]: 'Alerta de intrusión enviada.',
  [UserEvent.Emergency]: 'Emergencia reportada, alarma activada.',
  [UserEvent.Mute]: 'Alarma silenciada en el edificio.',
};

export const USER_EVENT_ERROR_MESSAGE = 'El servidor rechazó la acción. Revisa tus permisos e intenta de nuevo.';
