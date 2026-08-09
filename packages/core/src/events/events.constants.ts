import { z } from 'zod';
import { EventType } from '../access';

// Who set the event off: someone from the app, or the hardware itself.
export const EventOrigin = {
  App: 'APP',
  Physical: 'PHYSICAL',
} as const;
export type EventOrigin = (typeof EventOrigin)[keyof typeof EventOrigin];
export const EventOriginSchema = z.enum(EventOrigin);

// A critical event with no incident row is pending: the absence is the state.
export const IncidentStatus = {
  InProgress: 'IN_PROGRESS',
  Done: 'DONE',
} as const;
export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];
export const IncidentStatusSchema = z.enum(IncidentStatus);

// The three ways of looking at the same history.
export const MonitorLens = {
  Critical: 'critical',
  Intrusions: 'intrusions',
  OpenDoor: 'open-door',
} as const;
export type MonitorLens = (typeof MonitorLens)[keyof typeof MonitorLens];
export const MonitorLensSchema = z.enum(MonitorLens);

// How urgent an event reads on screen.
export const EventSeverity = {
  Critical: 'CRITICAL',
  Warning: 'WARNING',
  Info: 'INFO',
} as const;
export type EventSeverity = (typeof EventSeverity)[keyof typeof EventSeverity];

type EventMeta = { label: string; severity: EventSeverity };

// Every type the hardware can report, in one place. The old panel translated 7
// of these and showed "Evento desconocido" for the other 24.
export const EVENT_META: Record<EventType, EventMeta> = {
  [EventType.OpenDoor]: { label: 'Puerta abierta', severity: EventSeverity.Info },
  [EventType.CloseDoor]: { label: 'Puerta cerrada', severity: EventSeverity.Info },
  [EventType.LongOpenDoor]: { label: 'Puerta abierta demasiado tiempo', severity: EventSeverity.Warning },
  [EventType.ForcedDoor]: { label: 'Puerta forzada', severity: EventSeverity.Critical },
  [EventType.Forced]: { label: 'Puerta forzada', severity: EventSeverity.Critical },
  [EventType.Intrusion]: { label: 'Intrusión', severity: EventSeverity.Critical },
  [EventType.RemotePanic]: { label: 'Botón de pánico', severity: EventSeverity.Critical },
  [EventType.Emergency]: { label: 'Emergencia', severity: EventSeverity.Critical },
  [EventType.PushButton]: { label: 'Botón de emergencia pulsado', severity: EventSeverity.Critical },
  [EventType.MedicalEmergency]: { label: 'Emergencia médica', severity: EventSeverity.Critical },
  [EventType.TechnicalSupport]: { label: 'Soporte técnico', severity: EventSeverity.Info },

  [EventType.BrokenSlave]: { label: 'Lectora esclava caída', severity: EventSeverity.Warning },
  [EventType.ReaderDisconnected]: { label: 'Lectora desconectada', severity: EventSeverity.Warning },
  [EventType.ElectronicFailure]: { label: 'Fallo electrónico', severity: EventSeverity.Warning },
  [EventType.ElectronicOpenMaster]: { label: 'Apertura electrónica, maestra', severity: EventSeverity.Info },
  [EventType.ElectronicOpenSlave]: { label: 'Apertura electrónica, esclava', severity: EventSeverity.Info },
  [EventType.DisconnectedBuilding]: { label: 'Edificio desconectado', severity: EventSeverity.Critical },
  [EventType.RestartRpi]: { label: 'Equipo del edificio reiniciado', severity: EventSeverity.Info },
  [EventType.RestartReader]: { label: 'Lectora reiniciada', severity: EventSeverity.Info },
  [EventType.Mute]: { label: 'Alarma silenciada', severity: EventSeverity.Info },

  [EventType.IrMove]: { label: 'Movimiento detectado', severity: EventSeverity.Warning },
  [EventType.GlassBroken]: { label: 'Vidrio roto', severity: EventSeverity.Critical },
  [EventType.BarrierDetected]: { label: 'Barrera detectada', severity: EventSeverity.Info },
  [EventType.BarrierCutted]: { label: 'Barrera cortada', severity: EventSeverity.Critical },

  [EventType.Fire]: { label: 'Incendio', severity: EventSeverity.Critical },
  [EventType.Smoke]: { label: 'Humo', severity: EventSeverity.Critical },
  [EventType.Gas]: { label: 'Fuga de gas', severity: EventSeverity.Critical },
  [EventType.Co2]: { label: 'CO2 alto', severity: EventSeverity.Critical },
  [EventType.Flood]: { label: 'Inundación', severity: EventSeverity.Critical },
  [EventType.WaterLevel]: { label: 'Nivel de agua', severity: EventSeverity.Warning },
  [EventType.Electricity]: { label: 'Fallo eléctrico', severity: EventSeverity.Warning },
  [EventType.Earthquake]: { label: 'Terremoto', severity: EventSeverity.Critical },
};

// The hardware can report a type we do not know yet, so this takes a string and
// says so instead of pretending nothing happened.
export function eventMeta(type: string | null | undefined): EventMeta {
  if (type === null || type === undefined || type === '') {
    return { label: 'Evento sin tipo', severity: EventSeverity.Warning };
  }
  return EVENT_META[type as EventType] ?? { label: type, severity: EventSeverity.Warning };
}
