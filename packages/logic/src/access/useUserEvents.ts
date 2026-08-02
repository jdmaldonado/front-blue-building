import type { DomainError, UserEvent } from '@bb/core';
import { useCallback, useEffect } from 'react';
import { useServices } from '../services/context';

export interface UseUserEventsCallbacks {
  onError?: (error: DomainError) => void;
}

export interface UserEvents {
  sendUserEvent: (event: UserEvent) => void;
}

// A separate hook because these actions appear in several screens.
export function useUserEvents(buildingId: string | null, callbacks?: UseUserEventsCallbacks): UserEvents {
  const { socketClient, logger } = useServices();

  useEffect(() => {
    return socketClient.onUserEventError((error) => {
      logger.error('User event rejected', { error });
      callbacks?.onError?.(error);
    });
  }, [socketClient, logger, callbacks]);

  const sendUserEvent = useCallback(
    (event: UserEvent) => {
      if (buildingId === null) {
        return;
      }
      socketClient.sendUserEvent({ buildingId, event });
    },
    [socketClient, buildingId],
  );

  return { sendUserEvent };
}
