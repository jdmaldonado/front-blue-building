import { useEffect } from 'react';
import { useServices } from '../services/context';
import { selectToken, useSessionStore } from './store';

// Opens the socket while there is a session and closes it on logout. Without
// this there are no camera frames and no door updates.
export function useSocketConnection(): void {
  const { socketClient } = useServices();
  const token = useSessionStore(selectToken);

  useEffect(() => {
    if (token === null) {
      return;
    }
    socketClient.connect(token);
    return () => socketClient.disconnect();
  }, [socketClient, token]);
}
