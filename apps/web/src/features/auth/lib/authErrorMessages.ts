import {
  AuthNetworkError,
  InvalidCredentialsError,
  InvalidResetTokenError,
  NoSpacesAssignedError,
  WeakPasswordError,
} from '@bb/core';
import { NETWORK_ALERT, type AlertMessage } from '../../shared';

const UNKNOWN_MESSAGE: AlertMessage = {
  variant: 'error',
  title: 'Algo salió mal',
  description: 'Intenta de nuevo en unos segundos.',
};

// The view decides what the user reads, from the domain error. It never looks at
// HTTP status codes: the gateway already translated them.
export function loginErrorMessage(error: unknown): AlertMessage {
  if (error instanceof InvalidCredentialsError) {
    return {
      variant: 'error',
      title: 'No pudimos iniciar sesión',
      description: 'Documento o contraseña incorrectos. Verifica e intenta de nuevo.',
    };
  }

  if (error instanceof NoSpacesAssignedError) {
    return {
      variant: 'warning',
      title: 'Tu usuario no tiene un espacio asignado',
      description: 'Pide al administrador de tu edificio que te asigne un apartamento.',
    };
  }

  if (error instanceof AuthNetworkError) {
    return NETWORK_ALERT;
  }

  return UNKNOWN_MESSAGE;
}

export function recoveryErrorMessage(error: unknown): AlertMessage {
  if (error instanceof InvalidResetTokenError) {
    return {
      variant: 'error',
      title: 'El enlace ya no es válido',
      description: 'Los enlaces caducan y solo se pueden usar una vez. Solicita uno nuevo.',
    };
  }

  if (error instanceof WeakPasswordError) {
    return {
      variant: 'error',
      title: 'La contraseña no es válida',
      description: 'Elige una contraseña más larga e intenta de nuevo.',
    };
  }

  if (error instanceof AuthNetworkError) {
    return NETWORK_ALERT;
  }

  return UNKNOWN_MESSAGE;
}
