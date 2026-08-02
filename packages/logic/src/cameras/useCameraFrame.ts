import { useEffect, useMemo, useState } from 'react';
import { useServices } from '../services/context';

// The socket never says a camera went down. After this gap without frames we
// show "no signal".
export const CAMERA_STALE_MS = 8_000;
const TICK_MS = 1_000;

export interface CameraFrame {
  src: string | null;
  lastFrameAt: number | null;
  isLive: boolean;
}

// We revoke the old object URL on every frame, so memory does not grow.
export function useCameraFrame(input: { buildingId: string; camId: string } | null): CameraFrame {
  const { socketClient } = useServices();
  const [src, setSrc] = useState<string | null>(null);
  const [lastFrameAt, setLastFrameAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (input === null) {
      return;
    }
    const { buildingId, camId } = input;
    let currentUrl: string | null = null;

    socketClient.subscribeCamStream({ buildingId, camId });
    const unsubscribe = socketClient.onCamFrame(camId, (frame) => {
      const url = URL.createObjectURL(new Blob([frame], { type: 'image/jpeg' }));
      if (currentUrl !== null) {
        URL.revokeObjectURL(currentUrl);
      }
      currentUrl = url;
      setSrc(url);
      setLastFrameAt(Date.now());
    });

    return () => {
      unsubscribe();
      socketClient.leaveCamStream({ buildingId, camId });
      if (currentUrl !== null) {
        URL.revokeObjectURL(currentUrl);
      }
      setSrc(null);
      setLastFrameAt(null);
    };
  }, [socketClient, input]);

  // Without this tick, a frozen camera would still show "live" until the next
  // render.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return useMemo(
    () => ({
      src,
      lastFrameAt,
      isLive: lastFrameAt !== null && now - lastFrameAt < CAMERA_STALE_MS,
    }),
    [src, lastFrameAt, now],
  );
}
