import { z } from 'zod';

// What the card opens for: a person on foot or a vehicle at the gate.
export const CardType = {
  Person: 'PERSON',
  Car: 'CAR',
} as const;
export type CardType = (typeof CardType)[keyof typeof CardType];
export const CardTypeSchema = z.enum(CardType);

// The reader stays in register mode for this long, then restores itself
// (RPI/src/domain/handlers/CardSetupHandler.js:7).
export const CARD_SETUP_WINDOW_MS = 60_000;
