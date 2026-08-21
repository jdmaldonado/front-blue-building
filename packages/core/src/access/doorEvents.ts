import { DoorStatus, EventType } from './access.constants';
import type { DoorEventData } from './access.schemas';

// Reading a door event: what it means, and how to keep it without losing the
// reader telemetry that shares the same message.

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

// The `eventType` of a telemetry frame is made up
// (handleTelemetryNotify.ts:60), so a frame with hardware fields is not a door event.
export function isReaderTelemetry(event: DoorEventData | undefined): boolean {
  if (event === undefined) {
    return false;
  }
  return (
    (event.readerState !== null && event.readerState !== undefined) ||
    event.masterStatus !== null ||
    event.slaveStatus !== null ||
    event.masterSpiOk !== null ||
    event.slaveSpiOk !== null
  );
}

// After subscribing, the API sends one state per door with healthy defaults
// (DoorStatusDTO.ts:35). Only real telemetry has a timestamp.
export function isStartupState(event: DoorEventData): boolean {
  return (
    isReaderTelemetry(event) && (event.lastTelemetryTimestamp === null || event.lastTelemetryTimestamp === undefined)
  );
}

// Keeps both halves of the entry alive. Telemetry never replaces what the door
// last did, and a plain open or close never erases what the reader reported.
export function mergeDoorEvent(current: DoorEventData | undefined, incoming: DoorEventData): DoorEventData {
  if (current === undefined) {
    return incoming;
  }
  if (!isReaderTelemetry(incoming)) {
    return { ...current, ...incoming };
  }

  return {
    ...current,
    masterStatus: incoming.masterStatus,
    slaveStatus: incoming.slaveStatus,
    masterSpiOk: incoming.masterSpiOk,
    slaveSpiOk: incoming.slaveSpiOk,
    deviceType: incoming.deviceType,
    lastTelemetryTimestamp: incoming.lastTelemetryTimestamp,
    readerState: incoming.readerState,
  };
}
