import { UserEvent } from '@bb/core';
import { IconButton, cn, type IconButtonTone } from '../../../ui';
import type { UserEventActionsController } from '../hooks/useUserEventActions';
import { USER_EVENT_META, USER_EVENT_ORDER } from '../lib';

type UserEventActionsProps = {
  controller: UserEventActionsController;
  className?: string;
  buttonClassName?: string;
};

const TONES: Record<(typeof USER_EVENT_ORDER)[number], IconButtonTone> = {
  [UserEvent.Intrusion]: 'destructive',
  [UserEvent.Emergency]: 'warning',
  [UserEvent.Mute]: 'success',
};

// Icons only, so the row fits next to the primary action. Each one asks for
// confirmation first: without text, a tap by mistake is easy.
export function UserEventActions({ controller, className, buttonClassName }: UserEventActionsProps) {
  return (
    <div className={cn('flex min-w-0 gap-2', className)}>
      {USER_EVENT_ORDER.map((event) => {
        const meta = USER_EVENT_META[event];
        const Icon = meta.icon;

        return (
          <IconButton
            key={event}
            label={meta.title}
            tone={TONES[event]}
            size="lg"
            onClick={() => void controller.request(event)}
            className={buttonClassName}
          >
            <Icon size={22} />
          </IconButton>
        );
      })}
    </div>
  );
}
