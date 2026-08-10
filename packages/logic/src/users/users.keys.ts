export const userKeys = {
  all: ['users'] as const,
  residents: (buildingId?: string | null) => [...userKeys.all, 'residents', buildingId ?? 'all'] as const,
  byApartment: (apartmentId: string) => [...userKeys.all, 'apartment', apartmentId] as const,
  byDocument: (document: string) => [...userKeys.all, 'document', document] as const,
};
