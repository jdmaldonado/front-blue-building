import {
  CardEntrySchema,
  CardsResponseSchema,
  type CardList,
  type CreateCardInput,
  type UpdateCardInput,
} from '@bb/core';
import type { Logger } from '@bb/logger';
import type { HttpClient } from '../http';
import { readRows } from '../shared';
import { toCardsError } from './cards.errors';
import { CardsPath, cardPath, cardsByDocumentPath } from './cards.paths';

// Each card arrives inside `{ card: ... }`, the same way users do.
const CardRowSchema = CardEntrySchema.transform((entry) => entry.card);

export class CardsGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  async listByDocument(document: string): Promise<CardList> {
    const path = cardsByDocumentPath(document);
    try {
      const raw = await this.http.get({ path });
      const rows = CardsResponseSchema.parse(raw);
      const { items, skipped } = readRows(rows, CardRowSchema, { logger: this.logger, path, label: 'Card' });
      return { cards: items, skipped };
    } catch (error) {
      throw toCardsError(error);
    }
  }

  async create(input: CreateCardInput): Promise<void> {
    try {
      await this.http.post({ path: CardsPath.Cards, body: input });
    } catch (error) {
      throw toCardsError(error);
    }
  }

  async update(input: UpdateCardInput): Promise<void> {
    try {
      await this.http.put({
        path: cardPath(input.cardId),
        body: { tag: input.tag, type: input.type, active: input.active },
      });
    } catch (error) {
      throw toCardsError(error);
    }
  }

  // Hard delete on the API: there is no bin to recover it from.
  async remove(cardId: string): Promise<void> {
    try {
      await this.http.delete({ path: cardPath(cardId) });
    } catch (error) {
      throw toCardsError(error);
    }
  }
}
