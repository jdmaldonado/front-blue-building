import type { DoorCamera } from '@bb/core';
import { useCameraFrame } from '@bb/logic';
import { useMemo } from 'react';
import { Badge, cn } from '../../../ui';

type CameraTileProps = {
  camera: DoorCamera;
  buildingId: string;
  className?: string;
};

// "No signal" comes from the time since the last frame: the API never tells us
// that a camera went down.
export function CameraTile({ camera, buildingId, className }: CameraTileProps) {
  const input = useMemo(() => ({ buildingId, camId: camera.id }), [buildingId, camera.id]);
  const frame = useCameraFrame(input);

  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-(--radius-2) border bg-black',
        frame.isLive ? 'border-(--card-border)' : 'border-(--destructive)',
        className,
      )}
    >
      {frame.src === null ? (
        <div className="flex size-full items-center justify-center text-body-sm text-(--text-muted)">Conectando...</div>
      ) : (
        // `object-contain` and not `cover`: cameras are not always 16:9 and
        // cropping hides part of the scene.
        <img
          src={frame.src}
          alt={`Cámara ${camera.name ?? ''}`}
          className={cn('size-full object-contain', frame.isLive ? '' : 'opacity-60 grayscale')}
        />
      )}

      <div className="absolute top-2 left-2">
        {frame.isLive ? (
          <Badge tone="success" size="sm" dot pulse>
            En vivo
          </Badge>
        ) : (
          <Badge tone="danger" size="sm" dot>
            Sin señal
          </Badge>
        )}
      </div>

      <span className="absolute bottom-2 left-2 rounded-(--radius-1) bg-black/60 px-2 py-0.5 font-mono text-caption text-white">
        {camera.name ?? 'Cámara'}
      </span>
    </div>
  );
}
