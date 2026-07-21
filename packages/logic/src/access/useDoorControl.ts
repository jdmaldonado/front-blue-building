import type { DomainError } from '@bb/core';
import { useEffect } from 'react';
import { useServices } from '../services/context';

export interface UseDoorControlCallbacks {
  onError?: (error: DomainError) => void;
}

export interface DoorControl {
  openDoor: (localId: string) => void;
  closeDoor: (localId: string) => void;
}

export function useDoorControl(buildingId: string, callbacks?: UseDoorControlCallbacks): DoorControl {
  const { socketClient } = useServices();

  useEffect(() => {
    const unsubscribe = socketClient.onDoorActionError((error) => {
      callbacks?.onError?.(error);
    });
    return unsubscribe;
  }, [socketClient, callbacks]);

  return {
    openDoor: (localId) => socketClient.openDoor({ buildingId, localId }),
    closeDoor: (localId) => socketClient.closeDoor({ buildingId, localId }),
  };
}
