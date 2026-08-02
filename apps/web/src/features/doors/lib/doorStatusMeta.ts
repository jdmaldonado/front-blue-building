import { DoorStatus } from '@bb/core';
import type { BadgeTone } from '../../../ui';

export interface DoorStatusMeta {
  label: string;
  tone: BadgeTone;
  pinClassName: string;
  pulse: boolean;
}

const META: Record<DoorStatus, DoorStatusMeta> = {
  [DoorStatus.Open]: {
    label: 'Abierta',
    tone: 'success',
    pinClassName: 'bg-(--success)',
    pulse: false,
  },
  [DoorStatus.Closed]: {
    label: 'Cerrada',
    tone: 'neutral',
    pinClassName: 'bg-(--border-strong)',
    pulse: false,
  },
  [DoorStatus.Alert]: {
    label: 'Intrusión',
    tone: 'danger',
    pinClassName: 'bg-(--destructive)',
    pulse: true,
  },
  // After an API restart nothing is reported, and that is not a closed door.
  [DoorStatus.Unknown]: {
    label: 'Sin datos',
    tone: 'neutral',
    pinClassName: 'bg-(--text-muted)',
    pulse: false,
  },
};

export function doorStatusMeta(status: DoorStatus): DoorStatusMeta {
  return META[status];
}
