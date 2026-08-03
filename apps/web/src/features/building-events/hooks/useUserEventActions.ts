import { UserEvent } from '@bb/core';
import { useUserEvents } from '@bb/logic';
import { useCallback, useMemo, useState } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { USER_EVENT_CONFIRM, USER_EVENT_ERROR_MESSAGE, USER_EVENT_SENT_MESSAGE } from '../lib';

export type UserEventFeedback =
  | { tone: 'success'; title: string; message: string }
  | { tone: 'error'; title: string; message: string };

export interface UserEventActionsController {
  request: (event: UserEvent) => void;
  feedback: UserEventFeedback | null;
}

// The buttons live in the dialog footer and the feedback above it, so the state
// they share cannot sit inside either component.
export function useUserEventActions(buildingId: string): UserEventActionsController {
  const [feedback, setFeedback] = useState<UserEventFeedback | null>(null);
  const confirm = useConfirm();

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
      const spec = USER_EVENT_CONFIRM[event];
      if (spec === undefined) {
        emit(event);
        return;
      }

      void confirm({
        title: spec.title,
        description: spec.description,
        confirmLabel: spec.cta,
        intent: spec.intent,
      }).then((confirmed) => {
        if (confirmed) {
          emit(event);
        }
      });
    },
    [confirm, emit],
  );

  return { request, feedback };
}
