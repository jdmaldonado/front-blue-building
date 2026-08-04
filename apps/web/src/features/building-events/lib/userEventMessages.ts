import { UserEvent } from '@bb/core';
import { BellOff, Power, ShieldAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ButtonIntent } from '../../../ui';

export type UserEventMeta = {
  title: string;
  description: string;
  icon: LucideIcon;
  intent: ButtonIntent;
};

// Wording and colors come from the events screen of the current app: security
// in red, emergency in orange, mute in green.
export const USER_EVENT_META: Record<UserEvent, UserEventMeta> = {
  [UserEvent.Intrusion]: {
    title: 'Alerta de seguridad',
    description: 'Para intrusos o accesos no autorizados.',
    icon: ShieldAlert,
    intent: 'destructive',
  },
  [UserEvent.Emergency]: {
    title: 'Alerta de emergencia',
    description: 'Terremotos, incendios y otras situaciones críticas.',
    icon: TriangleAlert,
    intent: 'warning',
  },
  [UserEvent.Mute]: {
    title: 'Silenciar alarma',
    description: 'Solo si ya revisaste que todo está bien.',
    icon: BellOff,
    intent: 'success',
  },
  [UserEvent.RestartRpi]: {
    title: 'Reiniciar equipo',
    description: 'Reinicia la Raspberry Pi del edificio.',
    icon: Power,
    intent: 'destructive',
  },
};

// What a resident sees, from most urgent to least. Restarting is staff only, so
// it is not here.
export const USER_EVENT_ORDER: UserEvent[] = [UserEvent.Intrusion, UserEvent.Emergency, UserEvent.Mute];

export type ConfirmSpec = {
  title: string;
  description: string;
  cta: string;
  intent: ButtonIntent;
};

// An emergency has to go out the moment it is pressed: asking again costs
// seconds that matter. The other two do ask.
export const USER_EVENT_CONFIRM: Partial<Record<UserEvent, ConfirmSpec>> = {
  [UserEvent.Intrusion]: {
    title: '¿Reportar una alerta de seguridad?',
    description: 'Se avisa al staff del edificio de un intruso o un acceso no autorizado.',
    cta: 'Reportar',
    intent: 'destructive',
  },
  [UserEvent.Mute]: {
    title: '¿Silenciar la alarma?',
    description: 'Se silencia la alarma en todo el edificio. La acción queda registrada.',
    cta: 'Silenciar',
    intent: 'success',
  },
  [UserEvent.RestartRpi]: {
    title: '¿Reiniciar el equipo del edificio?',
    description: 'Mientras reinicia, el edificio queda sin conexión con el servidor.',
    cta: 'Reiniciar',
    intent: 'destructive',
  },
};

export const USER_EVENT_SENT_MESSAGE: Record<UserEvent, string> = {
  [UserEvent.Intrusion]: 'Alerta de intrusión enviada.',
  [UserEvent.Emergency]: 'Emergencia reportada, alarma activada.',
  [UserEvent.Mute]: 'Alarma silenciada en el edificio.',
  [UserEvent.RestartRpi]: 'Orden de reinicio enviada al edificio.',
};

export const USER_EVENT_ERROR_MESSAGE = 'El servidor rechazó la acción. Revisa tus permisos e intenta de nuevo.';
