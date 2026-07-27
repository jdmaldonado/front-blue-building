import { AccessGateway, AuthGateway, SocketClient, createFetchHttpClient } from '@bb/api-client';
import { useSessionStore, type Services } from '@bb/logic';
import { ConsoleLogger } from '@bb/logger';
import { API_BASE_URL, SOCKET_URL } from '../config/env';

export function createServices(): Services {
  const logger = new ConsoleLogger({ app: 'web' });
  const http = createFetchHttpClient({
    baseUrl: API_BASE_URL,
    getToken: () => useSessionStore.getState().token,
  });

  return {
    logger,
    authGateway: new AuthGateway(http),
    accessGateway: new AccessGateway(http),
    socketClient: new SocketClient({ url: SOCKET_URL, logger }),
  };
}
