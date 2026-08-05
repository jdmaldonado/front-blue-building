import { z } from 'zod';
import { ReaderTargetSchema } from './constants';

export const LogicFieldUnit = {
  Seconds: 'sec',
  Minutes: 'min',
} as const;
export type LogicFieldUnit = (typeof LogicFieldUnit)[keyof typeof LogicFieldUnit];

export interface LogicField {
  key: string;
  label: string;
  help: string;
  unit: LogicFieldUnit;
  min: number;
  max: number;
  defaultValue: number;
}

// 24 h expressed in each field's own unit.
const MAX_SECONDS = 86_400;
const MAX_MINUTES = 1_440;

// Declarative on purpose: adding a timing is adding an entry here, nothing else
// (mirrors LOGIC_FIELDS_SCHEMA from BB-428). Master only.
export const LOGIC_FIELDS: readonly LogicField[] = [
  {
    key: 'default_auth_door_open_sec',
    label: 'Tiempo de apertura',
    help: 'Cuánto queda desbloqueada la puerta tras un acceso válido.',
    unit: LogicFieldUnit.Seconds,
    min: 1,
    max: MAX_SECONDS,
    defaultValue: 5,
  },
  {
    key: 'door_open_grace_period_sec',
    label: 'Margen de puerta abierta',
    help: 'Cuánto puede estar abierta antes de generar una alerta.',
    unit: LogicFieldUnit.Seconds,
    min: 1,
    max: MAX_SECONDS,
    defaultValue: 60,
  },
  {
    key: 'door_held_event_interval_sec',
    label: 'Frecuencia de aviso',
    help: 'Cada cuánto se repite el aviso sonoro si la puerta sigue abierta.',
    unit: LogicFieldUnit.Seconds,
    min: 1,
    max: MAX_SECONDS,
    defaultValue: 5,
  },
  {
    key: 'alert_auto_silence_timeout_min',
    // The only field whose minimum is 0, and 0 means off.
    label: 'Apagado automático',
    help: 'Solo para emergencia, intrusión o puerta forzada. Apaga el sonido, pero la lectora mantiene su estado de alerta.',
    unit: LogicFieldUnit.Minutes,
    min: 0,
    max: MAX_MINUTES,
    defaultValue: 5,
  },
];

// Hardware switches and levels, master and slave. Kept as a loose record: the
// firmware owns this list and it grows without us.
export const ReaderHardwareConfigSchema = z.record(z.string(), z.union([z.boolean(), z.number()]));
export type ReaderHardwareConfig = z.infer<typeof ReaderHardwareConfigSchema>;

export const ReaderLogicConfigSchema = z.record(z.string(), z.number());
export type ReaderLogicConfig = z.infer<typeof ReaderLogicConfigSchema>;

export const ReaderConfigSchema = z.object({
  target: ReaderTargetSchema,
  hardware: ReaderHardwareConfigSchema.optional(),
  logic: ReaderLogicConfigSchema.optional(),
  wifi: z.object({ ssid: z.string().trim().min(1, 'Escribe el nombre de la red.') }).optional(),
});
export type ReaderConfig = z.infer<typeof ReaderConfigSchema>;

export const DEFAULT_MASTER_HARDWARE: ReaderHardwareConfig = {
  debug: true,
  buzzer_master_enabled: true,
  buzzer_alarm_enabled: true,
  buzzer_warning_enabled: true,
  buzzer_ui_enabled: true,
  speaker_enabled: true,
  rgb_enabled: true,
  relay_enabled: true,
  relay_inverted: false,
  button_emergency_enabled: true,
  allow_remote_emergency: false,
  endstop_enabled: true,
  door_sensor_enabled: true,
  door_sensor_inverted: false,
  intercom_enabled: false,
  buzzer_alarm_volume: 60,
  buzzer_warning_volume: 60,
  buzzer_ui_volume: 60,
  speaker_volume: 60,
  led_brightness: 150,
};

// The slave drives no door: no relay, no sensors, no emergency button.
export const DEFAULT_SLAVE_HARDWARE: ReaderHardwareConfig = {
  ...DEFAULT_MASTER_HARDWARE,
  relay_enabled: false,
  button_emergency_enabled: false,
  endstop_enabled: false,
  door_sensor_enabled: false,
};

export function defaultLogicConfig(): ReaderLogicConfig {
  return Object.fromEntries(LOGIC_FIELDS.map((field) => [field.key, field.defaultValue]));
}
