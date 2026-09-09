import { z } from 'zod';

// Which of the two boards the config is aimed at. The API rejects a config
// without it (api/src/hardware/index.ts:1230).
export const ReaderTarget = {
  Master: 'master',
  Slave: 'slave',
} as const;
export type ReaderTarget = (typeof ReaderTarget)[keyof typeof ReaderTarget];
export const ReaderTargetSchema = z.enum(ReaderTarget);

// How a reader state reads for someone watching the panel. The hardware sends
// dozens of state names; these are the five things the staff needs to tell
// apart.
export const ReaderHealth = {
  Online: 'ONLINE',
  Busy: 'BUSY',
  Warning: 'WARNING',
  Alert: 'ALERT',
  Offline: 'OFFLINE',
  Unknown: 'UNKNOWN',
} as const;
export type ReaderHealth = (typeof ReaderHealth)[keyof typeof ReaderHealth];

// Verbatim from the reader states the current panel already maps
// (front/src/views/admin-dashboard/bb/ReaderManager/ReaderStatusIndicator.jsx).
const READER_HEALTH_BY_STATE: Record<string, ReaderHealth> = {
  IDLE: ReaderHealth.Online,
  CLOSED: ReaderHealth.Online,
  CLOSE_DOOR: ReaderHealth.Online,
  DOOR_CLOSED: ReaderHealth.Online,
  OPEN: ReaderHealth.Online,
  OPEN_DOOR: ReaderHealth.Online,
  DOOR_OPEN: ReaderHealth.Online,
  ACCESS_GRANTED: ReaderHealth.Online,
  UNLOCKED: ReaderHealth.Online,

  ACCESS_CARD_READ: ReaderHealth.Busy,
  AUTH_PENDING: ReaderHealth.Busy,
  BOOTING: ReaderHealth.Busy,
  REGISTRATION_MODE: ReaderHealth.Busy,
  CONFIGURATION_MODE: ReaderHealth.Busy,

  DOOR_HELD_WARNING: ReaderHealth.Warning,
  SECURITY_DOOR_HELD: ReaderHealth.Warning,
  HELD_OPEN: ReaderHealth.Warning,

  EVACUATION_MODE: ReaderHealth.Alert,
  EMERGENCY: ReaderHealth.Alert,
  SECURITY_EMERGENCY_ACTIVATED: ReaderHealth.Alert,
  INTRUDER_ALERT: ReaderHealth.Alert,
  FORCED_OPEN: ReaderHealth.Alert,
  SECURITY_DOOR_FORCED: ReaderHealth.Alert,
  ACCESS_LOCKED: ReaderHealth.Alert,
  LOCKED: ReaderHealth.Alert,
  ACCESS_DENIED: ReaderHealth.Alert,

  READER_DISCONNECTED: ReaderHealth.Offline,
  SERVER_DISCONNECTED: ReaderHealth.Offline,
  BROKEN_SLAVE: ReaderHealth.Offline,
};

// New firmware states arrive without warning, so an unknown name is read by
// what it says instead of falling through to "fine".
export function readerHealthFromState(state: string | null | undefined): ReaderHealth {
  if (state === null || state === undefined || state.trim() === '') {
    return ReaderHealth.Unknown;
  }

  const key = state.toUpperCase();
  const known = READER_HEALTH_BY_STATE[key];
  if (known !== undefined) {
    return known;
  }

  if (key.includes('DISCONNECT') || key.includes('BROKEN') || key.includes('OFFLINE')) {
    return ReaderHealth.Offline;
  }
  if (key.includes('EMERGENCY') || key.includes('EVACUAT') || key.includes('INTRUS') || key.includes('FORCED')) {
    return ReaderHealth.Alert;
  }
  return ReaderHealth.Online;
}

// The reader restores itself if nothing answers, and the panel gives up here
// (front/.../ReaderReboot.jsx:50-57).
export const READER_REBOOT_TIMEOUT_MS = 15_000;

// Which microcontrollers receive the firmware update.
export const FirmwareTarget = {
  Master: 'master',
  Slave: 'slave',
  Both: 'both',
} as const;
export type FirmwareTarget = (typeof FirmwareTarget)[keyof typeof FirmwareTarget];
export const FirmwareTargetSchema = z.enum(FirmwareTarget);

// Hardware revisions of the ESP32 controller board.
export const HardwareVersion = {
  V6: '6.0',
  V5: '5.1',
} as const;
export type HardwareVersion = (typeof HardwareVersion)[keyof typeof HardwareVersion];
export const HardwareVersionSchema = z.enum(HardwareVersion);

// Flash memory sizes of the microcontroller.
export const FlashSize = {
  Flash4MB: '4MB',
  Flash8MB: '8MB',
  Flash16MB: '16MB',
} as const;
export type FlashSize = (typeof FlashSize)[keyof typeof FlashSize];
export const FlashSizeSchema = z.enum(FlashSize);

export const DEFAULT_FIRMWARE_VERSION = 'latest';
export const DEFAULT_OTA_PORT = 8000;

export interface BuildFirmwareUrlInput {
  hwVersion: HardwareVersion;
  flashSize: FlashSize;
  version?: string;
  host?: string;
  port?: number;
}

// Pure helper function that builds the standard canonical OTA firmware download URL.
export function buildDynamicFirmwareUrl(input: BuildFirmwareUrlInput): string {
  const hwNum = input.hwVersion.split('.')[0] || '6';
  const sizeFormatted = input.flashSize.toLowerCase();
  const ver = input.version && input.version.trim() ? input.version.trim() : DEFAULT_FIRMWARE_VERSION;
  const host = input.host || 'localhost';
  const port = input.port ?? DEFAULT_OTA_PORT;

  return `http://${host}:${port}/hw${hwNum}/${sizeFormatted}/${ver}/firmware-hw${hwNum}-${sizeFormatted}-${ver}.bin`;
}
