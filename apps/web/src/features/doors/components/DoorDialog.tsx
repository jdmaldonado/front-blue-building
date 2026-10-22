import { LoginMode, sortCamerasByName, type Door, type DoorStatus } from '@bb/core';
import { selectIsSuperUser, useSessionStore, type ReaderTelemetry } from '@bb/logic';
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Columns3,
  Cpu,
  DoorOpen,
  RectangleHorizontal,
  SwitchCamera,
} from 'lucide-react';
import { useMemo, useState, type KeyboardEvent } from 'react';
import { UserEventActions, useUserEventActions } from '../../building-events';
import { ReaderTelemetryDialog } from '../../readers';
import { Badge, Button, Dialog, IconButton, RadioGroup, Tabs, Text, cn, type RadioOption } from '../../../ui';
import { CameraColumns, useCameraColumns, useSwipe } from '../hooks';
import { doorStatusMeta } from '../lib';
import { CameraTile } from './CameraTile';
import { PageDots } from './PageDots';

type DoorDialogProps = {
  door: Door | null;
  status: DoorStatus;
  buildingId: string;
  // The doors of the floor, one tab each.
  doors: Door[];
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
  doors,
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
  // The resident already reads the status from the pin color on the plan.
  const isResident = useSessionStore((state) => state.session?.mode === LoginMode.Usuario);

  const cameras = useMemo(() => sortCamerasByName(door?.cameras ?? []), [door]);
  const hasCameras = cameras.length > 0;
  // A door with no local id has no reader behind it, so nothing would open.
  const canOpen = door?.localId !== null && door?.localId !== undefined;

  const index = doors.findIndex((item) => item.id === door?.id);
  // The next page comes in from the side it was asked from.
  const [slideFrom, setSlideFrom] = useState<'left' | 'right'>('right');

  const goTo = (doorId: string) => {
    setSlideFrom(doors.findIndex((item) => item.id === doorId) < index ? 'left' : 'right');
    onSelectDoor(doorId);
  };

  const hasTabs = doors.length > 1 && index >= 0;
  const previous = index > 0 ? doors[index - 1] : undefined;
  const next = index >= 0 ? doors[index + 1] : undefined;

  const goPrevious = () => {
    if (previous !== undefined) {
      goTo(previous.id);
    }
  };

  const goNext = () => {
    if (next !== undefined) {
      goTo(next.id);
    }
  };

  const swipe = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrevious });

  // The tabs and the segmented control of camera columns also answer the
  // arrows, and they call preventDefault when they do.
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
        // A fixed height when it pages, or it would grow and shrink from one
        // door to the next.
        className={hasTabs ? 'h-[85dvh]' : undefined}
        title={door?.floor?.name ?? 'Puertas'}
        // The floor carries the building name, and a resident only has one.
        hideTitle={isResident}
        headerAside={
          // In the header and not in the body: the body scrolls, and the status
          // and the reload button have to stay reachable while it does.
          <div className="flex items-center gap-2">
            {isResident ? null : (
              <Badge tone={meta.tone} dot pulse={meta.pulse} className="whitespace-nowrap">
                {meta.label}
              </Badge>
            )}
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
                  <SwitchCamera size={20} />
                </IconButton>
              </>
            ) : null}
            {isSuperUser && canOpen ? (
              <IconButton label="Estado del equipo" onClick={() => setShowTelemetry(true)}>
                <Cpu size={16} />
              </IconButton>
            ) : null}
          </div>
        }
        subheader={
          hasTabs ? (
            // Disabled at the ends instead of hidden, so the tabs never move.
            <div className="flex items-center gap-1">
              <IconButton
                label={previous?.name ? `Puerta anterior: ${previous.name}` : 'Puerta anterior'}
                hint={false}
                disabled={previous === undefined}
                onClick={goPrevious}
              >
                <ChevronLeft size={20} />
              </IconButton>
              <Tabs
                items={doors.map((item) => ({ value: item.id, label: item.name ?? 'Puerta' }))}
                value={doors[index]?.id ?? ''}
                onChange={goTo}
                label="Puertas del piso"
                className="min-w-0 flex-1"
              />
              <IconButton
                label={next?.name ? `Puerta siguiente: ${next.name}` : 'Puerta siguiente'}
                hint={false}
                disabled={next === undefined}
                onClick={goNext}
              >
                <ChevronRight size={20} />
              </IconButton>
            </div>
          ) : undefined
        }
        footer={
          door === null ? null : (
            // Two equal halves. On a phone the icons share their half; from sm
            // up they keep their square size. With no door to open they take the row.
            <div className={cn('grid w-full gap-2', canOpen ? 'grid-cols-2' : 'grid-cols-1')}>
              <UserEventActions controller={events} buttonClassName="flex-1 sm:flex-none" />
              {canOpen ? (
                <Button
                  size="lg"
                  onClick={() => onOpenDoor(door)}
                  loading={isOpening}
                  className="px-3 whitespace-nowrap"
                >
                  {isOpening ? null : <DoorOpen size={18} />}
                  {isOpening ? 'Abriendo...' : 'Abrir puerta'}
                </Button>
              ) : null}
            </div>
          )
        }
      >
        {door === null ? null : (
          // Fills the body, so a swipe works on the empty space too.
          <div className="min-h-full touch-pan-y touch-pinch-zoom" {...swipe}>
            {/* Clipped sideways so the page sliding in never shows a scrollbar. */}
            <div className="overflow-x-clip">
              <div
                key={door.id}
                className={cn(
                  'flex flex-col gap-4',
                  slideFrom === 'right' ? 'animate-slide-from-right' : 'animate-slide-from-left',
                )}
              >
                <div className="flex flex-col gap-2">
                  <Text as="h3" size="title" weight="bold">
                    {door.name ?? 'Puerta'}
                  </Text>
                  {hasTabs ? <PageDots count={doors.length} current={index} /> : null}
                </div>

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
            </div>
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
