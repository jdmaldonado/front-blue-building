import type { Door } from './access.schemas';

// The order the building wired them in. `numeric` puts "2" before "10", and the
// doors not wired yet go last.
export function sortDoorsByLocalId(doors: readonly Door[]): Door[] {
  return [...doors].sort((a, b) => {
    if (a.localId === b.localId) {
      return 0;
    }
    if (a.localId === null || a.localId === undefined) {
      return 1;
    }
    if (b.localId === null || b.localId === undefined) {
      return -1;
    }
    return a.localId.localeCompare(b.localId, undefined, { numeric: true });
  });
}
