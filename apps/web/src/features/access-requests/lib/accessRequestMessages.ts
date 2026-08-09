import {
  AccessRequestFailedError,
  AccessRequestGoneError,
  AccessRequestsNetworkError,
  ApproverNotVerifiedError,
} from '@bb/core';
import { NETWORK_ALERT, type AlertMessage } from '../../shared';

export function accessRequestErrorMessage(error: unknown): AlertMessage {
  if (error instanceof ApproverNotVerifiedError) {
    return {
      variant: 'warning',
      title: 'Tu cuenta todavía no está verificada',
      description: 'Hasta que la administración verifique tus datos no puedes aprobar a nadie.',
    };
  }

  if (error instanceof AccessRequestGoneError) {
    return {
      variant: 'warning',
      title: 'Esa solicitud ya no está',
      description: 'Puede que alguien la haya respondido antes. Actualiza la lista.',
    };
  }

  // The API sends no code for this, so the likeliest cause goes in the text.
  if (error instanceof AccessRequestFailedError) {
    return {
      variant: 'error',
      title: 'No pudimos responder la solicitud',
      description: 'Puede que el apartamento haya llegado a su máximo de residentes. Habla con la administración.',
    };
  }

  if (error instanceof AccessRequestsNetworkError) {
    return NETWORK_ALERT;
  }

  return {
    variant: 'error',
    title: 'Algo salió mal',
    description: 'Intenta de nuevo en unos segundos.',
  };
}
