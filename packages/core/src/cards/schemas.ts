import { z } from 'zod';
import { IdSchema } from '../shared';
import { CardTypeSchema } from './constants';

// Same split as the resident list: the tag identifies the card and is what every
// action needs, so it stays strict. The rest degrades instead of taking the
// whole list down.
export const CardSchema = z.object({
  id: IdSchema,
  tag: z.string(),

  type: CardTypeSchema.nullish().catch(null),
  active: z.boolean().nullish().catch(null),
  lastTimeUsed: z.union([z.string(), z.number()]).nullish().catch(null),
});
export type Card = z.infer<typeof CardSchema>;

// The API nests every card inside `{ card: ... }`, the same way it nests users
// (api/src/controllers/bluebuilding/cards/show_card_dto.ts:7).
export const CardEntrySchema = z.object({ card: CardSchema });

// What the list looks like before reading each entry: only "it is a list".
export const CardsResponseSchema = z.array(z.unknown());

export type CardList = {
  cards: Card[];
  skipped: number;
};

export const CreateCardInputSchema = z.object({
  userId: IdSchema,
  tag: z.string().trim().min(1, 'Pasa una tarjeta por la lectora o escribe el número.'),
  type: CardTypeSchema,
});
export type CreateCardInput = z.infer<typeof CreateCardInputSchema>;

export const UpdateCardInputSchema = z.object({
  cardId: IdSchema,
  tag: z.string().trim().min(1, 'El número de la tarjeta no puede quedar vacío.'),
  type: CardTypeSchema,
  active: z.boolean(),
});
export type UpdateCardInput = z.infer<typeof UpdateCardInputSchema>;

// Everything the card screen can be opened with. All optional: the screen asks
// for whatever it was not given.
export const CardsSearchSchema = z.object({
  document: z.string().optional(),
  buildingId: z.string().optional(),
  doorId: z.string().optional(),
});
export type CardsSearch = z.infer<typeof CardsSearchSchema>;

export const CardReaderStatus = {
  Idle: 'IDLE',
  Preparing: 'PREPARING',
  Waiting: 'WAITING',
  Read: 'READ',
  Failed: 'FAILED',
} as const;
export type CardReaderStatus = (typeof CardReaderStatus)[keyof typeof CardReaderStatus];
