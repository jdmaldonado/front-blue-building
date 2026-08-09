import type { Door } from './access.schemas';

// Critical events name their door but never identify it: `RecentEventDto` sends
// `event.door.name` and no id (api/src/2.0/events/dtos/RecentEvent.dto.ts:35).
// So the name is all we have to find the door, and with it its cameras.
//
// Names come from the same database on both sides, but they are typed by hand,
// so compare them trimmed and case insensitive. Two doors named alike resolve to
// the first one: better the wrong camera of the right building than none.
export function findDoorByName(doors: readonly Door[], name: string | null | undefined): Door | null {
  if (name === null || name === undefined) {
    return null;
  }

  const wanted = name.trim().toLowerCase();
  if (wanted === '') {
    return null;
  }

  return doors.find((door) => (door.name ?? '').trim().toLowerCase() === wanted) ?? null;
}
