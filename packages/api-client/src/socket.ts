import { DoorAction, DoorUpdateSchema, OutOfScheduleError, UnauthorizedDoorError } from '@bb/core';
import type { DomainError, DoorUpdate } from '@bb/core';
import type { Logger } from '@bb/logger';
import { io, type Socket } from 'socket.io-client';
import { z } from 'zod';

export interface SocketClientConfig {
  url: string;
  logger: Logger;
}

export type Unsubscribe = () => void;

const doorActionErrorSchema = z.object({ error: z.string() }).catch({ error: 'UNKNOWN' });

export class SocketClient {
  private readonly socket: Socket;
  private readonly logger: Logger;

  constructor(config: SocketClientConfig) {
    this.socket = io(config.url, { autoConnect: false, transports: ['websocket'] });
    this.logger = config.logger.child({ module: 'SocketClient' });
  }

  connect(token: string): void {
    this.socket.connect();
    this.socket.emit('init', { token });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  openDoor(input: { buildingId: string; localId: string }): void {
    this.emitDoorAction(input.buildingId, input.localId, DoorAction.Open);
  }

  closeDoor(input: { buildingId: string; localId: string }): void {
    this.emitDoorAction(input.buildingId, input.localId, DoorAction.Close);
  }

  onDoorActionError(callback: (error: DomainError) => void): Unsubscribe {
    const handler = (payload: unknown): void => {
      callback(mapDoorActionError(payload));
    };
    this.socket.on('door_action:error', handler);
    return () => {
      this.socket.off('door_action:error', handler);
    };
  }

  subscribeDoorStatus(buildingId: string): void {
    this.socket.emit('subscribe:door_status', { buildingId });
  }

  // Hides the dynamic event name `door_update_${buildingId}` and returns an
  // unsubscribe, so listeners never accumulate (a known leak in the legacy front).
  onDoorUpdate(buildingId: string, callback: (update: DoorUpdate) => void): Unsubscribe {
    const event = `door_update_${buildingId}`;
    const handler = (payload: unknown): void => {
      const parsed = DoorUpdateSchema.safeParse(payload);
      if (!parsed.success) {
        this.logger.warn('Invalid door_update payload', { event, issues: parsed.error.issues });
        return;
      }
      callback(parsed.data);
    };
    this.socket.on(event, handler);
    return () => {
      this.socket.off(event, handler);
    };
  }

  subscribeCamStream(input: { buildingId: string; camId: string }): void {
    this.socket.emit('subscribe:cam_stream', input);
  }

  leaveCamStream(input: { buildingId: string; camId: string }): void {
    this.socket.emit('leave:cam_stream', input);
  }

  // Forwards raw JPEG bytes from the dynamic `cam_streaming_${camId}` event.
  // Turning bytes into an image is platform-specific, so it stays in the UI layer.
  onCamFrame(camId: string, callback: (frame: ArrayBuffer) => void): Unsubscribe {
    const event = `cam_streaming_${camId}`;
    const handler = (frame: ArrayBuffer): void => {
      callback(frame);
    };
    this.socket.on(event, handler);
    return () => {
      this.socket.off(event, handler);
    };
  }

  private emitDoorAction(buildingId: string, localId: string, action: DoorAction): void {
    this.socket.emit('door_action', { buildingId, door: localId, action });
  }
}

// The API answers `AuthorizationError` for both missing permission and an
// unreachable RPI, so the two cannot be told apart here yet.
function mapDoorActionError(payload: unknown): DomainError {
  const { error } = doorActionErrorSchema.parse(payload);
  if (error === 'OutOfScheduleError') {
    return new OutOfScheduleError('Door is out of schedule');
  }
  return new UnauthorizedDoorError(`Door action rejected: ${error}`);
}
