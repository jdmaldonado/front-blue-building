import type { RadioOption } from '../../../ui';

export const MaintenanceDuration = {
  HalfHour: '30',
  OneHour: '60',
  TwoHours: '120',
  FourHours: '240',
  EightHours: '480',
  OneDay: '1440',
} as const;
export type MaintenanceDuration = (typeof MaintenanceDuration)[keyof typeof MaintenanceDuration];

export const MAINTENANCE_OPTIONS: ReadonlyArray<RadioOption<MaintenanceDuration>> = [
  { value: MaintenanceDuration.HalfHour, label: '30 minutos' },
  { value: MaintenanceDuration.OneHour, label: '1 hora' },
  { value: MaintenanceDuration.TwoHours, label: '2 horas' },
  { value: MaintenanceDuration.FourHours, label: '4 horas' },
  { value: MaintenanceDuration.EightHours, label: '8 horas' },
  { value: MaintenanceDuration.OneDay, label: '24 horas' },
];

export const DEFAULT_MAINTENANCE_DURATION: MaintenanceDuration = MaintenanceDuration.TwoHours;

const MINUTES_PER_HOUR = 60;
const MS_PER_MINUTE = 60_000;

// "Termina en 2 h 15 min". Rounds up so it never reads "0 min" while still on.
export function maintenanceRemaining(endsAt: Date, now: Date = new Date()): string {
  const minutes = Math.ceil((endsAt.getTime() - now.getTime()) / MS_PER_MINUTE);
  if (minutes <= 0) {
    return 'Terminando';
  }
  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
