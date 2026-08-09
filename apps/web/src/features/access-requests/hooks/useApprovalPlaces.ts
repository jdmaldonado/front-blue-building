import { listApprovalPlaces, type ApprovalPlace } from '@bb/core';
import { selectSpaces, useSessionStore } from '@bb/logic';
import { useMemo } from 'react';

// Where this person can approve, straight from the spaces the login returned.
export function useApprovalPlaces(): ApprovalPlace[] {
  const spaces = useSessionStore(selectSpaces);
  return useMemo(() => listApprovalPlaces(spaces), [spaces]);
}
