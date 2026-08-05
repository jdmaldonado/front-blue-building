import { CARD_SETUP_WINDOW_MS, CardReaderStatus, type DomainError } from '@bb/core';
import type { Unsubscribe } from '@bb/api-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useServices } from '../services/context';

const TICK_MS = 1000;
const MS_PER_SECOND = 1000;

export interface CardReaderInput {
  buildingId: string;
  localId: string;
}

export interface CardReaderCallbacks {
  onTag: (tag: string) => void;
  onError?: (error: DomainError) => void;
}

export interface CardReader {
  status: CardReaderStatus;
  // Seconds left in the register window. Zero when nothing is running.
  secondsLeft: number;
  start: (input: CardReaderInput) => void;
  stop: () => void;
}

// Drives one reader through its register window: ask, wait, read. The window
// closes on its own after a minute, so the countdown is the truth, not a guess.
export function useCardReader(callbacks: CardReaderCallbacks): CardReader {
  const { socketClient } = useServices();
  const [status, setStatus] = useState<CardReaderStatus>(CardReaderStatus.Idle);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const unsubscribe = useRef<Unsubscribe | null>(null);
  const deadline = useRef<number | null>(null);
  // Kept in a ref so a re-render of the caller never leaves us calling an old
  // version of these.
  const latest = useRef(callbacks);
  latest.current = callbacks;

  const release = useCallback(() => {
    unsubscribe.current?.();
    unsubscribe.current = null;
    deadline.current = null;
    setSecondsLeft(0);
  }, []);

  const stop = useCallback(() => {
    release();
    setStatus(CardReaderStatus.Idle);
  }, [release]);

  const start = useCallback(
    (input: CardReaderInput) => {
      release();
      setStatus(CardReaderStatus.Preparing);

      unsubscribe.current = socketClient.setupCardReader(input, {
        onReady: () => {
          deadline.current = Date.now() + CARD_SETUP_WINDOW_MS;
          setSecondsLeft(CARD_SETUP_WINDOW_MS / MS_PER_SECOND);
          setStatus(CardReaderStatus.Waiting);
        },
        onTag: (tag) => {
          release();
          setStatus(CardReaderStatus.Read);
          latest.current.onTag(tag);
        },
        onError: (error) => {
          release();
          setStatus(CardReaderStatus.Failed);
          latest.current.onError?.(error);
        },
      });
    },
    [release, socketClient],
  );

  useEffect(() => {
    if (status !== CardReaderStatus.Waiting) {
      return;
    }

    const timer = setInterval(() => {
      const end = deadline.current;
      if (end === null) {
        return;
      }
      const left = Math.max(0, Math.ceil((end - Date.now()) / MS_PER_SECOND));
      setSecondsLeft(left);
      if (left === 0) {
        // The reader restores itself at this point, so there is nothing to
        // cancel: we just stop listening.
        release();
        setStatus(CardReaderStatus.Idle);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [status, release]);

  useEffect(() => release, [release]);

  return { status, secondsLeft, start, stop };
}
