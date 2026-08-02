import type { Door, DoorStatus } from '@bb/core';
import { DoorOpen } from 'lucide-react';
import { UserEventActions, UserEventFeedback, useUserEventActions } from '../../building-events';
import { Badge, Button, Dialog } from '../../../ui';
import { doorStatusMeta } from '../lib';
import { CameraTile } from './CameraTile';

type DoorDialogProps = {
  door: Door | null;
  status: DoorStatus;
  buildingId: string;
  onClose: () => void;
  onOpenDoor: (door: Door) => void;
};

export function DoorDialog({ door, status, buildingId, onClose, onOpenDoor }: DoorDialogProps) {
  const meta = doorStatusMeta(status);
  const events = useUserEventActions(buildingId);

  return (
    <Dialog
      open={door !== null}
      onClose={onClose}
      size="lg"
      title={door?.name ?? 'Puerta'}
      description={door?.floor?.name ?? undefined}
      headerAside={
        <Badge tone={meta.tone} dot pulse={meta.pulse}>
          {meta.label}
        </Badge>
      }
      footer={
        door === null ? null : (
          <div className="flex w-full flex-col gap-2">
            <UserEventFeedback controller={events} />
            {/* Reversed on mobile so the events sit above the primary action,
                while the DOM keeps "Abrir puerta" first for keyboard order. */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={() => onOpenDoor(door)}
                className="w-full bg-[image:var(--pattern-honeycomb)] bg-[length:39px_22.52px] sm:w-auto sm:flex-[2]"
              >
                <DoorOpen size={18} />
                Abrir puerta
              </Button>
              <UserEventActions controller={events} className="sm:flex-[3]" />
            </div>
          </div>
        )
      }
    >
      {door === null ? null : (
        <div className="flex flex-col gap-4">
          {door.cameras.length === 0 ? (
            <p className="text-body text-(--text-secondary)">Esta puerta no tiene cámaras asociadas.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {door.cameras.map((camera) => (
                <CameraTile key={camera.id} camera={camera} buildingId={buildingId} />
              ))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
