import type { Door } from './access.schemas';

const PLAN_MAX_PERCENT = 100;

function isOnPlan(percent: number | null | undefined): boolean {
  return percent === null || percent === undefined || (percent >= 0 && percent <= PLAN_MAX_PERCENT);
}

// Some doors only link cameras to events, and the building parks them off the
// plan with left/top at 1000. They exist, but are neither drawn nor counted.
export function isDoorOnPlan(door: Door): boolean {
  return isOnPlan(door.left) && isOnPlan(door.top);
}
