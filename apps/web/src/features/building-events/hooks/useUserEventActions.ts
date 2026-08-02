import { UserEvent } from '@bb/core';
import { useUserEvents } from '@bb/logic';
import { useCallback, useMemo, useState } from 'react';
import { USER_EVENT_CONFIRM, USER_EVENT_ERROR_MESSAGE, USER_EVENT_SENT_MESSAGE, type ConfirmSpec } from '../lib';

export type UserEventFeedback =
  | { tone: 'success'; title: string; message: string }
  | { tone: 'error'; title: string; message: string };

export interface UserEventActionsController {
  request: (event: UserEvent) => void;
  confirmSpec: ConfirmSpec | null;
  confirm: () => void;
  cancel: () => void;
  feedback: UserEventFeedback | null;
}

// The buttons live in the dialog footer and the feedback above it, so the state
// they share cannot sit inside either component.
export function useUserEventActions(buildingId: string): UserEventActionsController {
  const [pending, setPending] = useState<UserEvent | null>(null);
  const [feedback, setFeedback] = useState<UserEventFeedback | null>(null);

  const onError = useCallback(() => {
    setFeedback({ tone: 'error', title: 'No pudimos enviar el evento', message: USER_EVENT_ERROR_MESSAGE });
  }, []);

  const { sendUserEvent } = useUserEvents(
    buildingId,
    useMemo(() => ({ onError }), [onError]),
  );

  const emit = useCallback(
    (event: UserEvent) => {
      sendUserEvent(event);
      setFeedback({ tone: 'success', title: 'Listo', message: USER_EVENT_SENT_MESSAGE[event] });
    },
    [sendUserEvent],
  );

  const request = useCallback(
    (event: UserEvent) => {
      if (USER_EVENT_CONFIRM[event] === undefined) {
        emit(event);
        return;
      }
      setPending(event);
    },
    [emit],
  );

  const confirm = useCallback(() => {
    if (pending !== null) {
      emit(pending);
    }
    setPending(null);
  }, [emit, pending]);

  const cancel = useCallback(() => setPending(null), []);

  return {
    request,
    confirmSpec: pending === null ? null : (USER_EVENT_CONFIRM[pending] ?? null),
    confirm,
    cancel,
    feedback,
  };
}
