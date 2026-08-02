import type { Door, DoorStatus, Floor } from '@bb/core';
import { cn } from '../../../ui';
import { DoorPin } from './DoorPin';

type FloorPlanProps = {
  floor: Floor | null;
  doors: Door[];
  statusOf: (door: Door) => DoorStatus;
  selectedDoorId: string | null;
  onSelect: (door: Door) => void;
  className?: string;
};

// The plan image comes from `Floor.image`. Without it the pins still show.
export function FloorPlan({ floor, doors, statusOf, selectedDoorId, onSelect, className }: FloorPlanProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-(--card-radius) border border-(--card-border) bg-(--surface-inverse)',
        className,
      )}
    >
      {floor?.image ? (
        <img src={floor.image} alt={`Plano de ${floor.name ?? 'el piso'}`} className="size-full object-contain" />
      ) : (
        <div className="flex size-full items-center justify-center p-6 text-center text-body-sm text-(--text-muted)">
          Este piso no tiene plano cargado. Las puertas se muestran igual, en su posición registrada.
        </div>
      )}

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
  );
}
