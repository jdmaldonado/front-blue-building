import {
  AccessGateway,
  AuthGateway,
  BuildingsGateway,
  CardsGateway,
  EventsGateway,
  SocketClient,
  UsersGateway,
  createFetchHttpClient,
} from '@bb/api-client';
import { selectToken, useSessionStore, type Services } from '@bb/logic';
import { ConsoleLogger } from '@bb/logger';
import { getAppConfig } from '../config';
import { endSession } from './session';

export function createServices(): Services {
  const config = getAppConfig();
  const logger = new ConsoleLogger({ app: 'web' });
  const http = createFetchHttpClient({
    baseUrl: config.api.baseUrl,
    getToken: () => selectToken(useSessionStore.getState()),
    // The API rejected a request we signed with the stored token, so nothing in
    // the app is usable from here.
    onUnauthorized: endSession,
  });

  return {
    logger,
    authGateway: new AuthGateway(http),
    accessGateway: new AccessGateway(http),
    buildingsGateway: new BuildingsGateway(http),
    cardsGateway: new CardsGateway(http, logger),
    eventsGateway: new EventsGateway(http, logger),
    usersGateway: new UsersGateway(http, logger),
    socketClient: new SocketClient({ url: config.socket.url, logger }),
  };
}
