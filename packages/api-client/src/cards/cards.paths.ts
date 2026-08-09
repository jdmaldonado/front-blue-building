export const CardsPath = {
  Cards: '/api/bluebuilding/cardsv2',
} as const;

export function cardPath(cardId: string): string {
  return `${CardsPath.Cards}/${cardId}`;
}

export function cardsByDocumentPath(document: string): string {
  return `${CardsPath.Cards}?document=${encodeURIComponent(document)}`;
}
