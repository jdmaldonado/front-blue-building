import type { AlertVariant } from '../../../ui';

// What a screen shows when an action fails: the same three pieces an `Alert`
// needs. Each feature turns its own domain errors into one of these.
export interface AlertMessage {
  variant: AlertVariant;
  title: string;
  description: string;
}

// The one case that reads the same everywhere: the request never got through.
export const NETWORK_ALERT: AlertMessage = {
  variant: 'error',
  title: 'Sin conexión con el servidor',
  description: 'Revisa tu conexión e intenta de nuevo.',
};
