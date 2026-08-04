import type { Door, DoorStatus } from '@bb/core';
import { DoorOpen, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { UserEventActions, useUserEventActions } from '../../building-events';
import { Badge, Button, Dialog, IconButton, Text } from '../../../ui';
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
  // A stream can freeze without anyone telling us. Changing this number gives
  // every tile a new key, so React unmounts them: they leave the stream and
  // subscribe again from zero.
  const [reloadToken, setReloadToken] = useState(0);

  return (
    <Dialog
      open={door !== null}
      onClose={onClose}
      size="lg"
      title={door?.name ?? 'Puerta'}
      description={door?.floor?.name ?? undefined}
      headerAside={
        <div className="flex items-center gap-2">
          <Badge tone={meta.tone} dot pulse={meta.pulse}>
            {meta.label}
          </Badge>
          {door !== null && door.cameras.length > 0 ? (
            <IconButton label="Recargar cámaras" onClick={() => setReloadToken((current) => current + 1)}>
              <RefreshCw size={16} />
            </IconButton>
          ) : null}
        </div>
      }
      footer={
        door === null ? null : (
          // Reversed on mobile so the events sit above the primary action,
          // while the DOM keeps "Abrir puerta" first for keyboard order.
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => onOpenDoor(door)} className="w-full sm:w-auto sm:flex-[2]">
              <DoorOpen size={18} />
              Abrir puerta
            </Button>
            <UserEventActions controller={events} className="sm:flex-[3]" />
          </div>
        )
      }
    >
      {door === null ? null : (
        <div className="flex flex-col gap-4">
          {door.cameras.length === 0 ? (
            <Text tone="secondary">Esta puerta no tiene cámaras asociadas.</Text>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {door.cameras.map((camera) => (
                <CameraTile key={`${camera.id}-${reloadToken}`} camera={camera} buildingId={buildingId} />
              ))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
