import { AccessGateway, AuthGateway, BuildingsGateway, SocketClient, createFetchHttpClient } from '@bb/api-client';
import { selectToken, useSessionStore, type Services } from '@bb/logic';
import { ConsoleLogger } from '@bb/logger';
import { getAppConfig } from '../config';
import { AppRoute } from './navigation';
import { queryClient } from './queryClient';
import { router } from './router';

// The API rejected a request we signed with the stored token. Nothing in the
// app is usable from here, so we drop the session and the cached data and send
// the user back to login.
function closeSession(): void {
  const { session, clearSession } = useSessionStore.getState();
  if (session === null) {
    return;
  }
  clearSession();
  queryClient.clear();
  void router.navigate({ to: AppRoute.Login, replace: true });
}

export function createServices(): Services {
  const config = getAppConfig();
  const logger = new ConsoleLogger({ app: 'web' });
  const http = createFetchHttpClient({
    baseUrl: config.api.baseUrl,
    getToken: () => selectToken(useSessionStore.getState()),
    onUnauthorized: closeSession,
  });

  return {
    logger,
    authGateway: new AuthGateway(http),
    accessGateway: new AccessGateway(http),
    buildingsGateway: new BuildingsGateway(http),
    socketClient: new SocketClient({ url: config.socket.url, logger }),
  };
}
