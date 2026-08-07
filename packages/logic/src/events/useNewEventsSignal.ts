import { isReaderTelemetry } from '@bb/core';
import { useCallback, useEffect, useState } from 'react';
import { useServices } from '../services/context';

export interface NewEventsSignal {
  // How many arrived since the list was last read.
  count: number;
  clear: () => void;
}

// Tells the monitor that something happened without reloading under the reader's
// hands.
//
// It listens on the doors room, not the events room. The API emits the full
// event to `${buildingId}.events`, but `subscribe:building_events` joins
// `${buildingId}.doors` (api/src/hardware/buildingDoorRooms.ts:4), so nobody
// ever receives those. Until that is fixed, door events are the only live
// signal there is: it covers a forced or held door, and misses the ones with no
// door, like a building going offline.
export function useNewEventsSignal(buildingId: string | null): NewEventsSignal {
  const { socketClient } = useServices();
  const [count, setCount] = useState(0);

  const clear = useCallback(() => setCount(0), []);

  useEffect(() => {
    if (buildingId === null) {
      return;
    }

    setCount(0);
    socketClient.subscribeDoorStatus(buildingId);

    const unsubscribe = socketClient.onDoorUpdate(buildingId, (update) => {
      // Telemetry travels on the same event and is not something that happened
      // in the building: counting it would cry wolf on every reader heartbeat.
      if (isReaderTelemetry(update.event)) {
        return;
      }
      setCount((current) => current + 1);
    });

    return () => {
      unsubscribe();
      socketClient.leaveDoorStatus(buildingId);
    };
  }, [buildingId, socketClient]);

  return { count, clear };
}
