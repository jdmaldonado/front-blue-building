import type { IntrusionEvent } from '@bb/core';
import { Button, Dialog, Text } from '../../../ui';
import { CameraTile } from '../../doors';
import { formatEventDate } from '../lib';

type IntrusionSequenceDialogProps = {
  event: IntrusionEvent | null;
  onClose: () => void;
};

// The photos of the episode, and the same camera live underneath. The only link
// between the two is the camera id the event carries.
export function IntrusionSequenceDialog({ event, onClose }: IntrusionSequenceDialogProps) {
  const canStream =
    event !== null &&
    event.buildingId !== null &&
    event.buildingId !== undefined &&
    event.cameraId !== null &&
    event.cameraId !== undefined;

  return (
    <Dialog
      open={event !== null}
      onClose={onClose}
      size="lg"
      title={event?.cameraName ?? 'Secuencia'}
      description={
        event === null ? undefined : `${formatEventDate(event.startTime)} — ${formatEventDate(event.endTime)}`
      }
      footer={
        <Button appearance="ghost" intent="neutral" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      {event === null ? null : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Text size="label" weight="medium">
              Secuencia ({event.imageCount})
            </Text>
            {event.imageUrls.length === 0 ? (
              <Text size="body-sm" tone="secondary">
                Esta secuencia no tiene fotos guardadas.
              </Text>
            ) : (
              <>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {event.imageUrls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      loading="lazy"
                      className="h-44 flex-none border border-(--card-border) object-cover"
                    />
                  ))}
                </div>
                {event.imageCount > event.imageUrls.length ? (
                  <Text size="body-sm" tone="secondary">
                    Mostramos las primeras {event.imageUrls.length}. Esta secuencia agrupa {event.imageCount} capturas,
                    que es más un día entero de esa cámara que un episodio.
                  </Text>
                ) : null}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Text size="label" weight="medium">
              En vivo
            </Text>
            {canStream ? (
              <CameraTile
                camera={{ id: event.cameraId as string, name: event.cameraName }}
                buildingId={event.buildingId as string}
              />
            ) : (
              <Text size="body-sm" tone="secondary">
                Este evento no dice de qué cámara vino, así que no podemos abrirla.
              </Text>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
