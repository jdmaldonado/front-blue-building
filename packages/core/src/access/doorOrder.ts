import type { Door, DoorCamera } from './access.schemas';

// `numeric` puts "2" before "10". The empty ones go last.
function compareText(a: string | null | undefined, b: string | null | undefined): number {
  if (a === b) {
    return 0;
  }
  if (a === null || a === undefined) {
    return 1;
  }
  if (b === null || b === undefined) {
    return -1;
  }
  return a.localeCompare(b, undefined, { numeric: true });
}

// The order the building wired them in.
export function sortDoorsByLocalId(doors: readonly Door[]): Door[] {
  return [...doors].sort((a, b) => compareText(a.localId, b.localId));
}

// Same order as the old app.
export function sortCamerasByName(cameras: readonly DoorCamera[]): DoorCamera[] {
  return [...cameras].sort((a, b) => compareText(a.name, b.name));
}
