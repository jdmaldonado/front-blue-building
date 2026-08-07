import { findDoorByName, type CriticalEvent, type DoorCamera } from '@bb/core';
import { useAccessibleDoors } from '@bb/logic';
import { Button, Dialog, Loading, Text } from '../../../ui';
import { CameraTile } from '../../doors';
import { formatEventDate } from '../lib';

type EventCameraDialogProps = {
  event: CriticalEvent | null;
  onClose: () => void;
};

// The camera of the door that raised the event, without leaving the list. The
// event only names its door, so the doors of the building are loaded here and
// the match happens by name.
//
// Same source as the live screen on purpose. The other door endpoint (POST
// /api/bluebuilding/doors) never loads `doorCameras`, so every door came back
// with an empty camera list.
export function EventCameraDialog({ event, onClose }: EventCameraDialogProps) {
  const buildingId = event?.buildingId ?? null;
  const doors = useAccessibleDoors(buildingId);

  const door = findDoorByName(doors.data ?? [], event?.door);
  const cameras = door?.cameras ?? [];

  return (
    <Dialog
      open={event !== null}
      onClose={onClose}
      size="lg"
      title={event?.door ?? 'Cámara'}
      description={event === null ? undefined : `${event.buildingName ?? ''} · ${formatEventDate(event.createdAt)}`}
      footer={
        <Button appearance="ghost" intent="neutral" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      {event === null || buildingId === null ? null : (
        <Body
          buildingId={buildingId}
          cameras={cameras}
          doorFound={door !== null}
          isPending={doors.isPending}
          isError={doors.isError}
        />
      )}
    </Dialog>
  );
}

type BodyProps = {
  buildingId: string;
  cameras: readonly DoorCamera[];
  doorFound: boolean;
  isPending: boolean;
  isError: boolean;
};

function Body({ buildingId, cameras, doorFound, isPending, isError }: BodyProps) {
  if (isPending) {
    return <Loading label="Buscando la puerta..." />;
  }

  if (isError) {
    return (
      <Text size="body-sm" tone="secondary">
        No pudimos cargar las puertas del edificio, así que no sabemos qué cámara mirar.
      </Text>
    );
  }

  if (!doorFound) {
    return (
      <Text size="body-sm" tone="secondary">
        No encontramos esta puerta entre las que puedes ver. Puede que la hayan renombrado desde que ocurrió el evento,
        o que sea una puerta privada a la que tu usuario no tiene acceso.
      </Text>
    );
  }

  if (cameras.length === 0) {
    return (
      <Text size="body-sm" tone="secondary">
        Esta puerta no tiene cámaras asignadas.
      </Text>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cameras.map((camera) => (
        <CameraTile key={camera.id} camera={camera} buildingId={buildingId} />
      ))}
    </div>
  );
}
