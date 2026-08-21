import type { Socket } from 'socket.io-client';

// We leave a room when the last view goes, not the first.
type RoomUsers<TInput> = { input: TInput; count: number };

export interface SocketRoomsConfig<TInput> {
  socket: Socket;
  joinEvent: string;
  leaveEvent: string;
  // Door rooms are keyed by building; camera rooms by camera.
  keyOf: (input: TInput) => string;
  payloadOf: (input: TInput) => unknown;
  // A view can ask before the session is ready. Then `rejoinAll` sends it.
  isReady: () => boolean;
}

// Same counting for door status and for camera streams.
export class SocketRooms<TInput> {
  private readonly config: SocketRoomsConfig<TInput>;
  private readonly rooms = new Map<string, RoomUsers<TInput>>();

  constructor(config: SocketRoomsConfig<TInput>) {
    this.config = config;
  }

  join(input: TInput): void {
    const key = this.config.keyOf(input);
    const room = this.rooms.get(key);
    if (room !== undefined) {
      room.count += 1;
      return;
    }

    this.rooms.set(key, { input, count: 1 });
    if (this.config.isReady()) {
      this.emit(this.config.joinEvent, input);
    }
  }

  leave(input: TInput): void {
    const room = this.rooms.get(this.config.keyOf(input));
    if (room === undefined) {
      return;
    }

    room.count -= 1;
    if (room.count <= 0) {
      this.rooms.delete(this.config.keyOf(input));
      this.emit(this.config.leaveEvent, input);
    }
  }

  // After a reconnect the server socket is new and has no rooms.
  rejoinAll(): void {
    for (const room of this.rooms.values()) {
      this.emit(this.config.joinEvent, room.input);
    }
  }

  clear(): void {
    this.rooms.clear();
  }

  private emit(event: string, input: TInput): void {
    this.config.socket.emit(event, this.config.payloadOf(input));
  }
}
