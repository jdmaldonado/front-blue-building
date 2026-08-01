import { AuthNetworkError, InvalidCredentialsError, NoSpacesAssignedError } from '@bb/core';
import type { AlertVariant } from '../../ui';

export interface LoginErrorMessage {
  variant: AlertVariant;
  title: string;
  description: string;
}

// The view decides what the user reads, from the domain error. It never looks at
// HTTP status codes: the gateway already translated them.
export function loginErrorMessage(error: unknown): LoginErrorMessage {
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
    return {
      variant: 'error',
      title: 'Sin conexión con el servidor',
      description: 'Revisa tu conexión e intenta de nuevo.',
    };
  }

  return {
    variant: 'error',
    title: 'Algo salió mal',
    description: 'Intenta de nuevo en unos segundos.',
  };
}
