import type { Door, DoorStatus } from '@bb/core';
import { selectIsSuperUser, useSessionStore, type ReaderTelemetry } from '@bb/logic';
import { ArrowLeft, ArrowRight, Columns2, Columns3, Cpu, DoorOpen, RectangleHorizontal, RefreshCw } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { UserEventActions, useUserEventActions } from '../../building-events';
import { ReaderTelemetryDialog } from '../../readers';
import { Badge, Button, Dialog, IconButton, RadioGroup, Text, cn, type RadioOption } from '../../../ui';
import { CameraColumns, useCameraColumns, useSwipe } from '../hooks';
import { doorStatusMeta } from '../lib';
import { CameraTile } from './CameraTile';

type DoorDialogProps = {
  door: Door | null;
  status: DoorStatus;
  buildingId: string;
  previousDoor: Door | null;
  nextDoor: Door | null;
  isOpening: boolean;
  // Hardware of this door. Only staff gets to look at it.
  telemetry: ReaderTelemetry | null;
  onClose: () => void;
  onSelectDoor: (doorId: string) => void;
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

export function DoorDialog({
  door,
  status,
  buildingId,
  previousDoor,
  nextDoor,
  isOpening,
  telemetry,
  onClose,
  onSelectDoor,
  onOpenDoor,
}: DoorDialogProps) {
  const meta = doorStatusMeta(status);
  const events = useUserEventActions(buildingId);
  const { columns, setColumns } = useCameraColumns();
  // A stream can freeze without anyone telling us. Changing this number gives
  // every tile a new key, so React unmounts them: they leave the stream and
  // subscribe again from zero.
  const [reloadToken, setReloadToken] = useState(0);
  const [showTelemetry, setShowTelemetry] = useState(false);
  // The hardware is staff business, and the API only answers it to SUPER_USER.
  const isSuperUser = useSessionStore(selectIsSuperUser);

  const cameras = door?.cameras ?? [];
  const hasCameras = cameras.length > 0;

  const goPrevious = () => {
    if (previousDoor !== null) {
      onSelectDoor(previousDoor.id);
    }
  };

  const goNext = () => {
    if (nextDoor !== null) {
      onSelectDoor(nextDoor.id);
    }
  };

  const swipe = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrevious });

  // The segmented control of camera columns also answers the arrows, and it
  // calls preventDefault when it does.
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      goPrevious();
    }
    if (event.key === 'ArrowRight') {
      goNext();
    }
  };

  return (
    <>
      <Dialog
        open={door !== null}
        onClose={onClose}
        onKeyDown={handleKeyDown}
        size="xl"
        title={door?.name ?? 'Puerta'}
        description={door?.floor?.name ?? undefined}
        headerAside={
          // In the header and not in the body: the body scrolls, and the status
          // and the reload button have to stay reachable while it does.
          <div className="flex items-center gap-2">
            <Badge tone={meta.tone} dot pulse={meta.pulse} className="whitespace-nowrap">
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
            {isSuperUser && door?.localId !== null && door?.localId !== undefined ? (
              <IconButton label="Estado del equipo" onClick={() => setShowTelemetry(true)}>
                <Cpu size={16} />
              </IconButton>
            ) : null}
          </div>
        }
        footer={
          door === null ? null : (
            // Reversed on mobile so the events sit above the primary action,
            // while the DOM keeps "Abrir puerta" first for keyboard order.
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={() => onOpenDoor(door)}
                loading={isOpening}
                className="w-full sm:w-auto sm:flex-[2]"
              >
                {isOpening ? null : <DoorOpen size={18} />}
                {isOpening ? 'Abriendo...' : 'Abrir puerta'}
              </Button>
              <UserEventActions controller={events} className="sm:flex-[3]" />
            </div>
          )
        }
      >
        {door === null ? null : (
          <div className="flex touch-pan-y flex-col gap-4" {...swipe}>
            {previousDoor === null && nextDoor === null ? null : (
              // Each arrow on its own edge, so the thumb finds them where the
              // swipe would take it.
              <div className="flex items-center justify-between gap-2">
                {previousDoor === null ? (
                  <span />
                ) : (
                  <Button intent="neutral" appearance="ghost" size="sm" onClick={goPrevious} className="min-w-0">
                    <ArrowLeft size={16} />
                    <span className="truncate">{previousDoor.name ?? 'Anterior'}</span>
                  </Button>
                )}
                {nextDoor === null ? (
                  <span />
                ) : (
                  <Button intent="neutral" appearance="ghost" size="sm" onClick={goNext} className="min-w-0">
                    <span className="truncate">{nextDoor.name ?? 'Siguiente'}</span>
                    <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            )}

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

      {/* A sibling and not a child: nesting one dialog inside another mixes
          their close events and both would go away at once. */}
      <ReaderTelemetryDialog
        open={showTelemetry}
        doorName={door?.name ?? 'Puerta'}
        telemetry={telemetry}
        onClose={() => setShowTelemetry(false)}
      />
    </>
  );
}
