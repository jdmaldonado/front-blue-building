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

// Door events and reader telemetry travel on the same socket event, and the API
// fills `eventType` on a telemetry frame with the master status or the literal
// `IDLE` (api/src/hardware/handlers/handleTelemetryNotify.ts:60). That value
// says nothing about the door, so a frame carrying hardware fields must not be
// read as a door event.
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

// The API also sends this event to whoever just subscribed, once per door
// (api/src/hardware/index.ts:1147-1155). That frame fills in what it does not
// know instead of leaving it empty: a door with no telemetry arrives as
// `CLOSED` / `IDLE` with both SPI buses fine (api/src/2.0/doors/dto/
// DoorStatusDTO.ts:35-41), which reads as a healthy reader. There is no way to
// tell that apart from a reader that really reported it, so we do not read it.
//
// It is the only frame with hardware fields and no `lastTelemetryTimestamp`:
// real telemetry always carries one (api/src/hardware/handlers/
// handleTelemetryNotify.ts:57).
//
// TODO: read it again once that DTO sends null for what it does not know. It is
// the only way to see reader health without waiting for something to change.
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
