import { LogicFieldUnit, ReaderHealth, ReaderTimeoutError, type DomainError } from '@bb/core';
import type { BadgeTone } from '../../../ui';

export type ReaderHealthMeta = {
  label: string;
  tone: BadgeTone;
  pulse: boolean;
};

export const READER_HEALTH_META: Record<ReaderHealth, ReaderHealthMeta> = {
  [ReaderHealth.Online]: { label: 'En línea', tone: 'success', pulse: false },
  [ReaderHealth.Busy]: { label: 'Ocupada', tone: 'accent', pulse: true },
  [ReaderHealth.Warning]: { label: 'Atención', tone: 'warning', pulse: false },
  [ReaderHealth.Alert]: { label: 'Alerta', tone: 'danger', pulse: true },
  [ReaderHealth.Offline]: { label: 'Desconectada', tone: 'danger', pulse: false },
  [ReaderHealth.Unknown]: { label: 'Sin datos', tone: 'neutral', pulse: false },
};

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

// The staff should not have to divide by 60 in their head.
export function formatDuration(value: number, unit: LogicFieldUnit): string {
  if (unit === LogicFieldUnit.Minutes) {
    if (value === 0) {
      return 'deshabilitado';
    }
    if (value < MINUTES_PER_HOUR) {
      return `${value} min`;
    }
    const hours = Math.floor(value / MINUTES_PER_HOUR);
    const minutes = value % MINUTES_PER_HOUR;
    return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
  }

  if (value < SECONDS_PER_MINUTE) {
    return `${value} s`;
  }
  const minutes = Math.floor(value / SECONDS_PER_MINUTE);
  const seconds = value % SECONDS_PER_MINUTE;
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} s`;
}

const SECONDS_PER_HOUR = 3600;
const HOURS_PER_DAY = 24;
const BYTES_PER_KB = 1024;

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (SECONDS_PER_HOUR * HOURS_PER_DAY));
  const hours = Math.floor((seconds % (SECONDS_PER_HOUR * HOURS_PER_DAY)) / SECONDS_PER_HOUR);
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  if (days > 0) {
    return `${days} d ${hours} h`;
  }
  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

export function formatBytes(bytes: number): string {
  return `${Math.round(bytes / BYTES_PER_KB)} KB`;
}

export function readerErrorMessage(error: DomainError): string {
  if (error instanceof ReaderTimeoutError) {
    return 'La lectora no contestó en 15 segundos. Puede estar apagada o sin red.';
  }
  return 'La API no encontró la lectora conectada. Revisa que el equipo del edificio esté en línea.';
}

// Success only means the order left the API (api/src/hardware/index.ts:1259).
export const READER_SENT_MESSAGE = 'La orden salió. La lectora no confirma si la aplicó.';
