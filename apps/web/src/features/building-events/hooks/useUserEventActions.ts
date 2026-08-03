import type { UserEvent } from '@bb/core';
import { useUserEvents } from '@bb/logic';
import { useCallback, useMemo } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { USER_EVENT_CONFIRM, USER_EVENT_ERROR_MESSAGE, USER_EVENT_SENT_MESSAGE } from '../lib';

export interface UserEventActionsController {
  // Resolves to true once the event was sent, false if the user backed out.
  request: (event: UserEvent) => Promise<boolean>;
}

export function useUserEventActions(buildingId: string): UserEventActionsController {
  const confirm = useConfirm();
  const toast = useToast();

  const onError = useCallback(() => {
    toast({ tone: 'error', title: 'No pudimos enviar el evento', message: USER_EVENT_ERROR_MESSAGE });
  }, [toast]);

  const { sendUserEvent } = useUserEvents(
    buildingId,
    useMemo(() => ({ onError }), [onError]),
  );

  const request = useCallback(
    async (event: UserEvent) => {
      const spec = USER_EVENT_CONFIRM[event];
      if (spec !== undefined) {
        const confirmed = await confirm({
          title: spec.title,
          description: spec.description,
          confirmLabel: spec.cta,
          intent: spec.intent,
        });
        if (!confirmed) {
          return false;
        }
      }

      sendUserEvent(event);
      toast({ tone: 'success', title: 'Listo', message: USER_EVENT_SENT_MESSAGE[event] });
      return true;
    },
    [confirm, sendUserEvent, toast],
  );

  return { request };
}
