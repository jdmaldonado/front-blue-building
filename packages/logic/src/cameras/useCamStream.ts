import { useEffect } from 'react';
import { useServices } from '../services/context';

// Manages the subscribe/leave lifecycle for one camera and forwards raw frames.
// Memoize `input` and `onFrame` in the caller to avoid re-subscribing each render.
export function useCamStream(
  input: { buildingId: string; camId: string } | null,
  onFrame: (frame: ArrayBuffer) => void,
): void {
  const { socketClient } = useServices();

  useEffect(() => {
    if (input === null) {
      return;
    }
    const { buildingId, camId } = input;
    socketClient.subscribeCamStream({ buildingId, camId });
    const unsubscribe = socketClient.onCamFrame(camId, onFrame);
    return () => {
      unsubscribe();
      socketClient.leaveCamStream({ buildingId, camId });
    };
  }, [socketClient, input, onFrame]);
}
