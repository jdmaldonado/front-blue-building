import { DoorAction, DoorUpdateSchema, isStartupState, OutOfScheduleError, UnauthorizedDoorError } from '@bb/core';
import type { DomainError, DoorUpdate, ReaderConfig, UserEvent } from '@bb/core';
import type { Logger } from '@bb/logger';
import { io, type Socket } from 'socket.io-client';
import { z } from 'zod';
import { configureReader, rebootReader, setupCardReader } from './socket.readers';
import type { CardReaderCallbacks, ReaderCallbacks, ReaderTarget } from './socket.readers';
import { SocketRooms } from './socket.rooms';
import type { Unsubscribe } from './socket.types';

export interface SocketClientConfig {
  url: string;
  logger: Logger;
}

const doorActionErrorSchema = z.object({ error: z.string() }).catch({ error: 'UNKNOWN' });

// `init` answers nothing, and a room asked too early is lost in silence
// (api/src/hardware/index.ts:593). So we wait before joining.
const SESSION_SETTLE_MS = 600;

type CamSubscription = { buildingId: string; camId: string };

export class SocketClient {
  private readonly socket: Socket;
  private readonly logger: Logger;
  private token: string | null = null;
  private sessionReady = false;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly camRooms: SocketRooms<CamSubscription>;
  private readonly doorStatusRooms: SocketRooms<string>;

  constructor(config: SocketClientConfig) {
    this.socket = io(config.url, { autoConnect: false, transports: ['websocket'] });
    this.logger = config.logger.child({ module: 'SocketClient' });

    const isReady = (): boolean => this.sessionReady;
    this.doorStatusRooms = new SocketRooms<string>({
      socket: this.socket,
      joinEvent: 'subscribe:door_status',
      leaveEvent: 'leave:door_status',
      keyOf: (buildingId) => buildingId,
      payloadOf: (buildingId) => ({ buildingId }),
      isReady,
    });
    this.camRooms = new SocketRooms<CamSubscription>({
      socket: this.socket,
      joinEvent: 'subscribe:cam_stream',
      leaveEvent: 'leave:cam_stream',
      keyOf: (input) => input.camId,
      payloadOf: (input) => input,
      isReady,
    });

    // A reconnect leaves us without session and without rooms.
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
      this.doorStatusRooms.rejoinAll();
      this.camRooms.rejoinAll();
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
    return this.listen('user_event:error', (payload: unknown) => callback(mapDoorActionError(payload)));
  }

  openDoor(input: { buildingId: string; localId: string }): void {
    this.emitDoorAction(input.buildingId, input.localId, DoorAction.Open);
  }

  closeDoor(input: { buildingId: string; localId: string }): void {
    this.emitDoorAction(input.buildingId, input.localId, DoorAction.Close);
  }

  onDoorActionError(callback: (error: DomainError) => void): Unsubscribe {
    return this.listen('door_action:error', (payload: unknown) => callback(mapDoorActionError(payload)));
  }

  setupCardReader(input: ReaderTarget, callbacks: CardReaderCallbacks): Unsubscribe {
    return setupCardReader(this.socket, this.logger, input, callbacks);
  }

  rebootReader(input: ReaderTarget, callbacks: ReaderCallbacks): Unsubscribe {
    return rebootReader(this.socket, input, callbacks);
  }

  configureReader(input: ReaderTarget & { config: ReaderConfig }, callbacks: ReaderCallbacks): Unsubscribe {
    return configureReader(this.socket, input, callbacks);
  }

  subscribeDoorStatus(buildingId: string): void {
    this.doorStatusRooms.join(buildingId);
  }

  leaveDoorStatus(buildingId: string): void {
    this.doorStatusRooms.leave(buildingId);
  }

  onDoorUpdate(buildingId: string, callback: (update: DoorUpdate) => void): Unsubscribe {
    const event = `door_update_${buildingId}`;
    return this.listen(event, (payload: unknown) => {
      const parsed = DoorUpdateSchema.safeParse(payload);
      if (!parsed.success) {
        this.logger.warn('Invalid door_update payload', { event, issues: parsed.error.issues });
        return;
      }
      // See isStartupState: the first state after subscribing is made up.
      if (isStartupState(parsed.data.event)) {
        return;
      }
      callback(parsed.data);
    });
  }

  subscribeCamStream(input: CamSubscription): void {
    this.camRooms.join(input);
  }

  leaveCamStream(input: CamSubscription): void {
    this.camRooms.leave(input);
  }

  // Raw JPEG bytes. The UI layer turns them into an image.
  onCamFrame(camId: string, callback: (frame: ArrayBuffer) => void): Unsubscribe {
    return this.listen(`cam_streaming_${camId}`, callback);
  }

  private emitDoorAction(buildingId: string, localId: string, action: DoorAction): void {
    this.socket.emit('door_action', { buildingId, door: localId, action });
  }

  private listen<TPayload>(event: string, handler: (payload: TPayload) => void): Unsubscribe {
    this.socket.on(event, handler);
    return () => {
      this.socket.off(event, handler);
    };
  }
}

// The API sends `AuthorizationError` both for no permission and for a dead RPI.
function mapDoorActionError(payload: unknown): DomainError {
  const { error } = doorActionErrorSchema.parse(payload);
  if (error === 'OutOfScheduleError') {
    return new OutOfScheduleError('Door is out of schedule');
  }
  return new UnauthorizedDoorError(`Door action rejected: ${error}`);
}
