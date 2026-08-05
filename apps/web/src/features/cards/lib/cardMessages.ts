import { CardType, UserNotVerifiedError } from '@bb/core';
import type { SelectOption } from '../../../ui';

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  [CardType.Person]: 'Persona',
  [CardType.Car]: 'Vehículo',
};

export const CARD_TYPE_OPTIONS: ReadonlyArray<SelectOption<CardType>> = [
  { value: CardType.Person, label: CARD_TYPE_LABEL[CardType.Person] },
  { value: CardType.Car, label: CARD_TYPE_LABEL[CardType.Car] },
];

export function cardErrorMessage(error: Error): string {
  if (error instanceof UserNotVerifiedError) {
    return 'Primero hay que validar al usuario con su foto y su documento.';
  }
  return 'Intenta de nuevo. Si sigue fallando, revisa tu conexión.';
}
