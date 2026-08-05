import type { ResidentDetails } from '@bb/core';

// One string per resident so the table can search across every visible field,
// tags included.
export function residentSearchText(resident: ResidentDetails): string {
  const tags = resident.tags.map((tag) => `${tag.tag} ${tag.type ?? ''}`).join(' ');
  return [
    resident.name,
    resident.cedula,
    resident.email ?? '',
    resident.phone ?? '',
    resident.apartmentName ?? '',
    resident.buildingName ?? '',
    tags,
  ]
    .join(' ')
    .toLowerCase();
}
