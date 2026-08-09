import {
  ApartmentClosedError,
  ApartmentNotFoundError,
  ApartmentRole,
  DuplicateRegistrationError,
  RegistrationNetworkError,
  RegistrationRejectedError,
} from '@bb/core';
import type { AlertVariant } from '../../../ui';

export interface RegistrationErrorMessage {
  variant: AlertVariant;
  title: string;
  description: string;
}

export function registrationErrorMessage(error: unknown, role: ApartmentRole): RegistrationErrorMessage {
  if (error instanceof DuplicateRegistrationError) {
    return {
      variant: 'error',
      title: 'Ya hay una cuenta con esos datos',
      description:
        error.field === 'email'
          ? 'Ese correo ya está registrado. Entra con tu contraseña o recupérala desde el acceso.'
          : 'Ese documento ya está registrado. Entra con tu contraseña o recupérala desde el acceso.',
    };
  }

  if (error instanceof RegistrationRejectedError) {
    return {
      variant: 'error',
      title: 'Revisa los datos',
      description: 'Algún dato no tiene el formato que esperamos. Corrígelo e intenta de nuevo.',
    };
  }

  if (error instanceof ApartmentNotFoundError) {
    return {
      variant: 'error',
      title: 'Ese apartamento ya no existe',
      description: 'Vuelve a elegirlo en la lista.',
    };
  }

  // An inactive apartment means different things depending on who is asking:
  // for an owner it is already claimed, for a resident it has no leader yet.
  if (error instanceof ApartmentClosedError) {
    return {
      variant: 'warning',
      title: 'Ese apartamento no admite solicitudes',
      description:
        role === ApartmentRole.Owner
          ? 'Puede que alguien ya se haya registrado como propietario. Habla con la administración del edificio.'
          : 'Todavía no tiene un propietario o líder que apruebe tu solicitud. Habla con la administración del edificio.',
    };
  }

  if (error instanceof RegistrationNetworkError) {
    return {
      variant: 'error',
      title: 'Sin conexión con el servidor',
      description: 'Revisa tu conexión e intenta de nuevo.',
    };
  }

  return {
    variant: 'error',
    title: 'No pudimos completar el registro',
    description: 'Intenta de nuevo en unos minutos. Si sigue igual, avisa a la administración del edificio.',
  };
}
