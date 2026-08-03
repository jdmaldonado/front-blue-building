import { Button, Dialog } from '../../../ui';
import type { UserEventActionsController } from '../hooks/useUserEventActions';
import { USER_EVENT_META, USER_EVENT_ORDER } from '../lib';

type EventsDialogProps = {
  open: boolean;
  onClose: () => void;
  controller: UserEventActionsController;
};

// The whole list of events with their explanation, the way the current app
// shows it. The door dialog keeps the short version of the same actions.
export function EventsDialog({ open, onClose, controller }: EventsDialogProps) {
  const request = async (event: (typeof USER_EVENT_ORDER)[number]) => {
    const sent = await controller.request(event);
    if (sent) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="md"
      title="Eventos"
      description="Usa las siguientes opciones para reportar:"
    >
      <div className="flex flex-col gap-3">
        {USER_EVENT_ORDER.map((event) => {
          const meta = USER_EVENT_META[event];
          const Icon = meta.icon;

          return (
            <Button
              key={event}
              intent={meta.intent}
              size="lg"
              onClick={() => void request(event)}
              className="h-auto w-full items-start gap-3 px-4 py-4 text-left"
            >
              <Icon size={22} className="mt-0.5 shrink-0" aria-hidden />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-body font-semibold">{meta.title}</span>
                <span className="text-body-sm font-normal opacity-90">{meta.description}</span>
              </span>
            </Button>
          );
        })}
      </div>
    </Dialog>
  );
}
