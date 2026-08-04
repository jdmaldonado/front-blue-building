import { DoorAction, DoorUpdateSchema, OutOfScheduleError, UnauthorizedDoorError, type UserEvent } from '@bb/core';
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

// `init` sets the session on the server socket and every `subscribe:*` needs it
// (api/src/hardware/index.ts:593, :1072). It answers nothing, so we wait before
// joining rooms. Too early and the subscription is lost without any error.
const SESSION_SETTLE_MS = 600;

type CamSubscription = { buildingId: string; camId: string };

// How many views asked for the same room. The room is left when the last one
// goes, so closing one camera does not cut the others.
type RoomUsers<TInput> = { input: TInput; count: number };

export class SocketClient {
  private readonly socket: Socket;
  private readonly logger: Logger;
  private token: string | null = null;
  private sessionReady = false;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly camRooms = new Map<string, RoomUsers<CamSubscription>>();
  private readonly doorStatusRooms = new Map<string, RoomUsers<string>>();

  constructor(config: SocketClientConfig) {
    this.socket = io(config.url, { autoConnect: false, transports: ['websocket'] });
    this.logger = config.logger.child({ module: 'SocketClient' });

    // A reconnect gives us a new socket on the server, with no session and no
    // rooms. Nobody else would notice, so we start over here.
    this.socket.on('connect', () => this.startSession());
    this.socket.on('disconnect', (reason: string) => {
      this.sessionReady = false;
      this.logger.warn('Socket disconnected', { reason });
    });
  }

  connect(token: string): void {
    this.token = token;
    this.socket.connect();
  }

  disconnect(): void {
    this.token = null;
    this.sessionReady = false;
    this.clearSettleTimer();
    this.camRooms.clear();
    this.doorStatusRooms.clear();
    this.socket.disconnect();
  }

  private startSession(): void {
    if (this.token === null) {
      return;
    }

    this.sessionReady = false;
    this.socket.emit('init', { token: this.token });

    this.clearSettleTimer();
    this.settleTimer = setTimeout(() => {
      this.sessionReady = true;
      for (const room of this.doorStatusRooms.values()) {
        this.socket.emit('subscribe:door_status', { buildingId: room.input });
      }
      for (const room of this.camRooms.values()) {
        this.socket.emit('subscribe:cam_stream', room.input);
      }
    }, SESSION_SETTLE_MS);
  }

  private clearSettleTimer(): void {
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
  }

  // The API sends these to the whole building, not to one door.
  sendUserEvent(input: { buildingId: string; event: UserEvent }): void {
    this.socket.emit('user_event', { buildingId: input.buildingId, event: input.event });
  }

  onUserEventError(callback: (error: DomainError) => void): Unsubscribe {
    const handler = (payload: unknown): void => {
      callback(mapDoorActionError(payload));
    };
    this.socket.on('user_event:error', handler);
    return () => {
      this.socket.off('user_event:error', handler);
    };
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

  // A view can mount before the socket is ready, so we keep what it asked for
  // and send it when the session starts.
  subscribeDoorStatus(buildingId: string): void {
    const room = this.doorStatusRooms.get(buildingId);
    if (room !== undefined) {
      room.count += 1;
      return;
    }

    this.doorStatusRooms.set(buildingId, { input: buildingId, count: 1 });
    if (this.sessionReady) {
      this.socket.emit('subscribe:door_status', { buildingId });
    }
  }

  leaveDoorStatus(buildingId: string): void {
    const room = this.doorStatusRooms.get(buildingId);
    if (room === undefined) {
      return;
    }

    room.count -= 1;
    if (room.count <= 0) {
      this.doorStatusRooms.delete(buildingId);
      this.socket.emit('leave:door_status', { buildingId });
    }
  }

  // Returns an unsubscribe so listeners do not pile up (a leak in the old front).
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

  subscribeCamStream(input: CamSubscription): void {
    const room = this.camRooms.get(input.camId);
    if (room !== undefined) {
      room.count += 1;
      return;
    }

    this.camRooms.set(input.camId, { input, count: 1 });
    if (this.sessionReady) {
      this.socket.emit('subscribe:cam_stream', input);
    }
  }

  leaveCamStream(input: CamSubscription): void {
    const room = this.camRooms.get(input.camId);
    if (room === undefined) {
      return;
    }

    room.count -= 1;
    if (room.count <= 0) {
      this.camRooms.delete(input.camId);
      this.socket.emit('leave:cam_stream', input);
    }
  }

  // Sends raw JPEG bytes. Making an image out of them depends on the platform,
  // so that happens in the UI layer.
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

// The API sends `AuthorizationError` both when the user has no permission and
// when the RPI is down. We cannot tell them apart yet.
function mapDoorActionError(payload: unknown): DomainError {
  const { error } = doorActionErrorSchema.parse(payload);
  if (error === 'OutOfScheduleError') {
    return new OutOfScheduleError('Door is out of schedule');
  }
  return new UnauthorizedDoorError(`Door action rejected: ${error}`);
}
