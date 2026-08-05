export const cardKeys = {
  all: ['cards'] as const,
  byDocument: (document: string) => [...cardKeys.all, 'document', document] as const,
};
