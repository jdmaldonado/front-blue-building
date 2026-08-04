import type { Door, DoorStatus } from '@bb/core';
import { Columns2, Columns3, DoorOpen, RectangleHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { UserEventActions, useUserEventActions } from '../../building-events';
import { Badge, Button, Dialog, IconButton, RadioGroup, Text, cn, type RadioOption } from '../../../ui';
import { CameraColumns, useCameraColumns } from '../hooks';
import { doorStatusMeta } from '../lib';
import { CameraTile } from './CameraTile';

type DoorDialogProps = {
  door: Door | null;
  status: DoorStatus;
  buildingId: string;
  onClose: () => void;
  onOpenDoor: (door: Door) => void;
};

// Only the icon shows. The label is what a screen reader announces.
const columnOptions: ReadonlyArray<RadioOption<CameraColumns>> = [
  { value: CameraColumns.One, label: 'Una por fila', icon: RectangleHorizontal },
  { value: CameraColumns.Two, label: 'Dos por fila', icon: Columns2 },
  { value: CameraColumns.Three, label: 'Tres por fila', icon: Columns3 },
];

// Literal classes: Tailwind reads the source as text and would not see them if
// they were built at runtime. Phones always get one per row.
const columnClasses: Record<CameraColumns, string> = {
  [CameraColumns.One]: 'sm:grid-cols-1',
  [CameraColumns.Two]: 'sm:grid-cols-2',
  [CameraColumns.Three]: 'sm:grid-cols-3',
};

export function DoorDialog({ door, status, buildingId, onClose, onOpenDoor }: DoorDialogProps) {
  const meta = doorStatusMeta(status);
  const events = useUserEventActions(buildingId);
  const { columns, setColumns } = useCameraColumns();
  // A stream can freeze without anyone telling us. Changing this number gives
  // every tile a new key, so React unmounts them: they leave the stream and
  // subscribe again from zero.
  const [reloadToken, setReloadToken] = useState(0);

  const cameras = door?.cameras ?? [];
  const hasCameras = cameras.length > 0;

  return (
    <Dialog
      open={door !== null}
      onClose={onClose}
      size="xl"
      title={door?.name ?? 'Puerta'}
      description={door?.floor?.name ?? undefined}
      headerAside={
        <div className="flex items-center gap-2">
          <Badge tone={meta.tone} dot pulse={meta.pulse}>
            {meta.label}
          </Badge>
          {hasCameras ? (
            <>
              {cameras.length > 1 ? (
                <RadioGroup
                  options={columnOptions}
                  value={columns}
                  onChange={setColumns}
                  label="Cámaras por fila"
                  appearance="segmented"
                  size="sm"
                  hideLabels
                  className="hidden sm:inline-flex"
                />
              ) : null}
              <IconButton label="Recargar cámaras" onClick={() => setReloadToken((current) => current + 1)}>
                <RefreshCw size={16} />
              </IconButton>
            </>
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
          {hasCameras ? (
            <div className={cn('grid gap-3', columnClasses[columns])}>
              {cameras.map((camera) => (
                <CameraTile key={`${camera.id}-${reloadToken}`} camera={camera} buildingId={buildingId} />
              ))}
            </div>
          ) : (
            <Text tone="secondary">Esta puerta no tiene cámaras asociadas.</Text>
          )}
        </div>
      )}
    </Dialog>
  );
}
