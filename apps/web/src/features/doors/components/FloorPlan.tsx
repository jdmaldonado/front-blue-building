import type { Door, DoorStatus, Floor } from '@bb/core';
import { useEffect, useRef, useState } from 'react';
import { CornerBrackets, Text, cn } from '../../../ui';
import { DoorPin } from './DoorPin';

type FloorPlanProps = {
  floor: Floor | null;
  doors: Door[];
  statusOf: (door: Door) => DoorStatus;
  selectedDoorId: string | null;
  onSelect: (door: Door) => void;
  className?: string;
};

type Box = { width: number; height: number };

// The image is a direct flex child so `max-h-full` resolves against the
// container, which is the only box with a known height. Wrapping it in a div
// first breaks that: the wrapper has auto height and the image overflows.
export function FloorPlan({ floor, doors, statusOf, selectedDoorId, onSelect, className }: FloorPlanProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  // The pins go on an overlay of exactly the rendered image size. Measuring is
  // the only way to know it: `object-contain` leaves empty space around the
  // plan, and `left`/`top` are percentages of the plan, not of the container.
  useEffect(() => {
    const image = imageRef.current;
    if (image === null) {
      setBox(null);
      return;
    }
    const observer = new ResizeObserver(() => {
      setBox({ width: image.clientWidth, height: image.clientHeight });
    });
    observer.observe(image);
    return () => observer.disconnect();
  }, [floor?.image]);

  return (
    <div
      className={cn(
        'relative flex min-h-0 items-center justify-center overflow-hidden rounded-(--card-radius) border border-(--card-border) bg-(--card-bg)',
        className,
      )}
    >
      <CornerBrackets />

      {floor?.image ? (
        <>
          <img
            ref={imageRef}
            src={floor.image}
            alt={`Plano de ${floor.name ?? 'el piso'}`}
            className="block max-h-full max-w-full object-contain"
          />
          {box === null ? null : (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: box.width, height: box.height }}
            >
              {doors.map((door) => (
                <DoorPin
                  key={door.id}
                  door={door}
                  status={statusOf(door)}
                  selected={door.id === selectedDoorId}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Text size="body-sm" tone="muted" className="p-6 text-center">
          Este piso no tiene plano cargado.
          {doors.length > 0 ? ` Tiene ${doors.length} puerta(s) registradas.` : ''}
        </Text>
      )}
    </div>
  );
}
