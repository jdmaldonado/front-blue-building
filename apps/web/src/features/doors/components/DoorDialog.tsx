import type { Door, DoorStatus } from '@bb/core';
import { DoorOpen } from 'lucide-react';
import { UserEventActions } from '../../building-events';
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
          <Button
            size="lg"
            onClick={() => onOpenDoor(door)}
            className="w-full bg-[image:var(--pattern-honeycomb)] bg-[length:39px_22.52px]"
          >
            <DoorOpen size={18} />
            Abrir puerta
          </Button>
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

          <UserEventActions buildingId={buildingId} />
        </div>
      )}
    </Dialog>
  );
}
