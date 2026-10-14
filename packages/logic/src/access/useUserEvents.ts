import type { DomainError, UserEvent } from '@bb/core';
import { useCallback, useEffect, useRef } from 'react';
import { useServices } from '../services/context';

// How long after sending an error is still taken as the answer to it.
const ERROR_WINDOW_MS = 10_000;

export interface UseUserEventsCallbacks {
  onError?: (error: DomainError) => void;
}

export interface UserEvents {
  sendUserEvent: (event: UserEvent) => void;
}

// A separate hook because these actions appear in several screens.
export function useUserEvents(buildingId: string | null, callbacks?: UseUserEventsCallbacks): UserEvents {
  const { socketClient, logger } = useServices();
  const lastSentAt = useRef<number | null>(null);

  // The API error does not say which building it is about, and every mounted
  // copy of this hook hears it. Only the one that just sent reacts.
  useEffect(() => {
    return socketClient.onUserEventError((error) => {
      const sentAt = lastSentAt.current;
      if (sentAt === null || Date.now() - sentAt > ERROR_WINDOW_MS) {
        return;
      }
      lastSentAt.current = null;
      logger.error('User event rejected', { error });
      callbacks?.onError?.(error);
    });
  }, [socketClient, logger, callbacks]);

  const sendUserEvent = useCallback(
    (event: UserEvent) => {
      if (buildingId === null) {
        return;
      }
      lastSentAt.current = Date.now();
      socketClient.sendUserEvent({ buildingId, event });
    },
    [socketClient, buildingId],
  );

  return { sendUserEvent };
}
