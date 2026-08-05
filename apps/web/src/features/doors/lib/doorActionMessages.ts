import { OutOfScheduleError, type DomainError } from '@bb/core';

// The API answers the same authorization error when the user has no permission
// and when the building box is offline, so one message has to cover both.
export function doorErrorMessage(error: DomainError): string {
  if (error instanceof OutOfScheduleError) {
    return 'Esta puerta no se puede abrir a esta hora.';
  }
  return 'No tienes permiso para esta puerta, o el equipo del edificio no está respondiendo.';
}

export const DOOR_NOT_WIRED_MESSAGE = 'Esta puerta todavía no está conectada a una lectora.';
export const DOOR_NO_ANSWER_MESSAGE = 'La orden salió, pero la puerta no confirmó. Revisa si se abrió.';
