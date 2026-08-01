import { AccessGateway, AuthGateway, SocketClient, createFetchHttpClient } from '@bb/api-client';
import { useSessionStore, type Services } from '@bb/logic';
import { ConsoleLogger } from '@bb/logger';
import { getAppConfig } from '../config';

export function createServices(): Services {
  const config = getAppConfig();
  const logger = new ConsoleLogger({ app: 'web' });
  const http = createFetchHttpClient({
    baseUrl: config.api.baseUrl,
    getToken: () => useSessionStore.getState().token,
  });

  return {
    logger,
    authGateway: new AuthGateway(http),
    accessGateway: new AccessGateway(http),
    socketClient: new SocketClient({ url: config.socket.url, logger }),
  };
}
