import {
  CardReaderError,
  READER_REBOOT_TIMEOUT_MS,
  ReaderTimeoutError,
  ReaderUnreachableError,
  type ReaderConfig,
} from '@bb/core';
import type { DomainError } from '@bb/core';
import type { Logger } from '@bb/logger';
import type { Socket } from 'socket.io-client';
import { z } from 'zod';
import type { Unsubscribe } from './socket.types';

export interface ReaderCallbacks {
  onSuccess: () => void;
  onError: (error: DomainError) => void;
}

export interface CardReaderCallbacks {
  onReady: () => void;
  onTag: (tag: string) => void;
  onError: (error: DomainError) => void;
}

export interface ReaderTarget {
  buildingId: string;
  localId: string;
}

// The reader answers READY once it is in register mode, or an error.
const cardSetupResponseSchema = z
  .object({ status: z.string().nullish(), error: z.string().nullish() })
  .catch({ status: null, error: 'UNKNOWN' });

const CARD_SETUP_READY = 'READY';

// "No socket found" means the reader is not connected.
const readerErrorSchema = z.object({ error: z.string().nullish() }).catch({ error: null });

// The tag arrives raw, sometimes as a number.
const readTagSchema = z.union([z.string(), z.number()]).transform((value) => String(value));

// Register mode ends by itself: after a minute, or after the first card.
export function setupCardReader(
  socket: Socket,
  logger: Logger,
  input: ReaderTarget,
  callbacks: CardReaderCallbacks,
): Unsubscribe {
  const onResponse = (payload: unknown): void => {
    const answer = cardSetupResponseSchema.parse(payload);
    if (answer.status === CARD_SETUP_READY) {
      callbacks.onReady();
      return;
    }
    callbacks.onError(new CardReaderError(answer.error ?? 'Reader did not get ready'));
  };

  // The API never removes its listener (HandleCardRegisterRequestParams.ts:30),
  // so the same card can arrive twice. We report only the first one.
  let delivered = false;
  const onTag = (payload: unknown): void => {
    if (delivered) {
      return;
    }
    const parsed = readTagSchema.safeParse(payload);
    if (!parsed.success) {
      logger.warn('Unreadable tag from reader', { issues: parsed.error.issues });
      return;
    }
    delivered = true;
    callbacks.onTag(parsed.data);
  };

  socket.once('card:setup:response', onResponse);
  socket.on('read_tag', onTag);
  socket.emit('card:setup', { buildingId: input.buildingId, door: input.localId });

  return () => {
    socket.off('card:setup:response', onResponse);
    socket.off('read_tag', onTag);
  };
}

// A reboot sometimes answers nothing, so the call has its own timeout.
export function rebootReader(socket: Socket, input: ReaderTarget, callbacks: ReaderCallbacks): Unsubscribe {
  return commandReader(socket, {
    answer: 'reader:reboot',
    request: 'frontend:reader:reboot',
    input,
    callbacks,
    timeoutMs: READER_REBOOT_TIMEOUT_MS,
  });
}

// Success means the API sent the config, not that the reader applied it
// (api/src/hardware/index.ts:1259). No timeout: we do not know a fair one.
export function configureReader(
  socket: Socket,
  input: ReaderTarget & { config: ReaderConfig },
  callbacks: ReaderCallbacks,
): Unsubscribe {
  return commandReader(socket, {
    answer: 'reader:config',
    request: 'frontend:reader:config',
    input,
    callbacks,
    timeoutMs: null,
  });
}

interface ReaderCommand {
  answer: string;
  request: string;
  input: ReaderTarget & { config?: ReaderConfig };
  callbacks: ReaderCallbacks;
  timeoutMs: number | null;
}

function commandReader(socket: Socket, command: ReaderCommand): Unsubscribe {
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const finish = (): void => {
    settled = true;
    if (timer !== null) {
      clearTimeout(timer);
    }
    socket.off(`${command.answer}:success`, onSuccess);
    socket.off(`${command.answer}:error`, onError);
  };

  const onSuccess = (): void => {
    if (settled) {
      return;
    }
    finish();
    command.callbacks.onSuccess();
  };

  const onError = (payload: unknown): void => {
    if (settled) {
      return;
    }
    finish();
    const reason = readerErrorSchema.parse(payload).error ?? '';
    command.callbacks.onError(new ReaderUnreachableError(reason === '' ? 'Reader did not answer' : reason));
  };

  socket.once(`${command.answer}:success`, onSuccess);
  socket.once(`${command.answer}:error`, onError);
  socket.emit(command.request, {
    buildingId: command.input.buildingId,
    localId: command.input.localId,
    ...(command.input.config === undefined ? {} : { config: command.input.config }),
  });

  if (command.timeoutMs !== null) {
    timer = setTimeout(() => {
      if (settled) {
        return;
      }
      finish();
      command.callbacks.onError(new ReaderTimeoutError('Reader did not answer in time'));
    }, command.timeoutMs);
  }

  return finish;
}
