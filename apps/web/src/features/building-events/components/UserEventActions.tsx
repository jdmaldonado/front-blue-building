import { UserEvent } from '@bb/core';
import { BellOff, TriangleAlert, Users } from 'lucide-react';
import { Button, cn } from '../../../ui';
import type { UserEventActionsController } from '../hooks/useUserEventActions';

type UserEventActionsProps = {
  controller: UserEventActionsController;
  className?: string;
};

// Buttons only: the feedback is rendered apart by `UserEventFeedback`, so the
// row can share a line with the primary action of the screen.
export function UserEventActions({ controller, className }: UserEventActionsProps) {
  return (
    <div className={cn('flex min-w-0 gap-2', className)}>
      <Button
        intent="warning"
        appearance="outline"
        size="sm"
        onClick={() => controller.request(UserEvent.Intrusion)}
        className="min-w-0 flex-1 px-2 sm:px-3"
      >
        <Users size={17} className="shrink-0" />
        <span className="truncate">Intruso</span>
      </Button>
      <Button
        intent="destructive"
        size="sm"
        onClick={() => controller.request(UserEvent.Emergency)}
        className="min-w-0 flex-1 px-2 sm:px-3"
      >
        <TriangleAlert size={17} className="shrink-0" />
        <span className="truncate">Emergencia</span>
      </Button>
      <Button
        intent="neutral"
        appearance="outline"
        size="sm"
        onClick={() => controller.request(UserEvent.Mute)}
        className="min-w-0 flex-1 px-2 sm:px-3"
      >
        <BellOff size={17} className="shrink-0" />
        <span className="truncate">Silenciar</span>
      </Button>
    </div>
  );
}
