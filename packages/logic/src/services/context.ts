import type { AccessGateway, AuthGateway, SocketClient } from '@bb/api-client';
import type { Logger } from '@bb/logger';
import { createContext, useContext } from 'react';

export interface Services {
  authGateway: AuthGateway;
  accessGateway: AccessGateway;
  socketClient: SocketClient;
  logger: Logger;
}

const ServicesContext = createContext<Services | null>(null);

export const ServicesProvider = ServicesContext.Provider;

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (services === null) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return services;
}
