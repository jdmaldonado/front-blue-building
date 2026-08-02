export const DoorType = {
  Public: 'PUBLIC',
  Private: 'PRIVATE',
  Reserved: 'RESERVED',
} as const;
export type DoorType = (typeof DoorType)[keyof typeof DoorType];

// The API uses HTTP-like numeric codes for door actions.
export const DoorAction = {
  Open: 200,
  Close: 201,
} as const;
export type DoorAction = (typeof DoorAction)[keyof typeof DoorAction];

// Sent to the whole building, not to one door (api/src/hardware/index.ts:835).
// The API also accepts RESTART_RPI; we do not expose it.
export const UserEvent = {
  Mute: 'MUTE',
  Intrusion: 'INTRUSION',
  Emergency: 'EMERGENCY',
} as const;

export type UserEvent = (typeof UserEvent)[keyof typeof UserEvent];

// All types the hardware can report (api/src/entity/Event.ts:15).
export const EventType = {
  OpenDoor: 'OPEN_DOOR',
  CloseDoor: 'CLOSE_DOOR',
  LongOpenDoor: 'LONG_OPEN_DOOR',
  ForcedDoor: 'FORCED_DOOR',
  Intrusion: 'INTRUSION',
  RemotePanic: 'REMOTE_PANIC',
  Emergency: 'EMERGENCY',
  BrokenSlave: 'BROKEN_SLAVE',
  ElectronicFailure: 'ELECTRONIC_FAILURE',
  ElectronicOpenMaster: 'ELECTRONIC_OPEN_MASTER',
  ElectronicOpenSlave: 'ELECTRONIC_OPEN_SLAVE',
  IrMove: 'IR_MOVE',
  GlassBroken: 'GLASS_BROKEN',
  BarrierDetected: 'BARRIER_DETECTED',
  BarrierCutted: 'BARRIER_CUTTED',
  Gas: 'GAS',
  Co2: 'CO2',
  Flood: 'FLOOD',
  Electricity: 'ELECTRICITY',
  WaterLevel: 'WATER_LEVEL',
  Fire: 'FIRE',
  Smoke: 'SMOKE',
  Earthquake: 'EARTHQUAKE',
  Mute: 'MUTE',
  DisconnectedBuilding: 'DISCONNECTED_BUILDING',
  PushButton: 'PUSH_BUTTON',
  Forced: 'FORCED',
  RestartRpi: 'RESTART_RPI',
  TechnicalSupport: 'TECHNICAL_SUPPORT',
  MedicalEmergency: 'MEDICAL_EMERGENCY',
  RestartReader: 'RESTART_READER',
  ReaderDisconnected: 'READER_DISCONNECTED',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

// The API has no door status. We derive it from the last event.
export const DoorStatus = {
  Open: 'OPEN',
  Closed: 'CLOSED',
  Alert: 'ALERT',
  // No event yet. The API keeps this state in memory, so after a restart every
  // door starts here. Unknown is not the same as closed.
  Unknown: 'UNKNOWN',
} as const;
export type DoorStatus = (typeof DoorStatus)[keyof typeof DoorStatus];

const OPEN_EVENTS: readonly EventType[] = [
  EventType.OpenDoor,
  EventType.LongOpenDoor,
  EventType.ElectronicOpenMaster,
  EventType.ElectronicOpenSlave,
  EventType.PushButton,
];

const ALERT_EVENTS: readonly EventType[] = [
  EventType.ForcedDoor,
  EventType.Forced,
  EventType.Intrusion,
  EventType.RemotePanic,
  EventType.Emergency,
  EventType.GlassBroken,
  EventType.BarrierCutted,
  EventType.IrMove,
  EventType.Fire,
  EventType.Smoke,
  EventType.Gas,
  EventType.Flood,
  EventType.Earthquake,
  EventType.MedicalEmergency,
];

// Takes a string: the hardware may send a type we do not know yet.
export function doorStatusFromEvent(eventType: string | null | undefined): DoorStatus {
  if (eventType === null || eventType === undefined) {
    return DoorStatus.Unknown;
  }
  if ((OPEN_EVENTS as readonly string[]).includes(eventType)) {
    return DoorStatus.Open;
  }
  if ((ALERT_EVENTS as readonly string[]).includes(eventType)) {
    return DoorStatus.Alert;
  }
  if (eventType === EventType.CloseDoor) {
    return DoorStatus.Closed;
  }
  // Other events (BROKEN_SLAVE, RESTART_*...) do not tell if the door is open.
  return DoorStatus.Unknown;
}
