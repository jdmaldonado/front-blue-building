import { EventSeverity, IncidentStatus, IncidentNotFoundError, eventMeta, type DomainError } from '@bb/core';
import type { BadgeTone } from '../../../ui';

export const SEVERITY_TONE: Record<EventSeverity, BadgeTone> = {
  [EventSeverity.Critical]: 'danger',
  [EventSeverity.Warning]: 'warning',
  [EventSeverity.Info]: 'neutral',
};

export function eventBadge(type: string | null | undefined): { label: string; tone: BadgeTone } {
  const meta = eventMeta(type);
  return { label: meta.label, tone: SEVERITY_TONE[meta.severity] };
}

export const INCIDENT_LABEL: Record<IncidentStatus, string> = {
  [IncidentStatus.InProgress]: 'En curso',
  [IncidentStatus.Done]: 'Resuelto',
};

// No incident row means nobody has picked it up yet.
export function incidentLabel(status: IncidentStatus | null | undefined): string {
  return status === null || status === undefined ? 'Pendiente' : INCIDENT_LABEL[status];
}

export function incidentTone(status: IncidentStatus | null | undefined): BadgeTone {
  if (status === IncidentStatus.Done) {
    return 'success';
  }
  return status === IncidentStatus.InProgress ? 'accent' : 'warning';
}

export function eventsErrorMessage(error: Error): string {
  if (error instanceof IncidentNotFoundError) {
    return 'Ese evento ya no tiene un incidente abierto. Recarga la lista.';
  }
  return 'Intenta de nuevo. Si sigue fallando, revisa tu conexión.';
}

// One formatter for the whole monitor. The old panel had three, and two of them
// used the browser's local time, so the same event read differently on each
// screen.
const FORMATTER = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
});

export function formatEventDate(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'Sin fecha';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin fecha' : FORMATTER.format(date);
}

export type DomainErrorLike = DomainError;
