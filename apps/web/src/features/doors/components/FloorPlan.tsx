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

// The pins go inside a box that is exactly the image box, not the container.
// Otherwise `left`/`top` percentages drift with the empty space that
// `object-contain` leaves around the plan.
export function FloorPlan({ floor, doors, statusOf, selectedDoorId, onSelect, className }: FloorPlanProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 items-center justify-center overflow-hidden rounded-(--card-radius) border border-(--card-border) bg-(--surface-inverse)',
        className,
      )}
    >
      {floor?.image ? (
        <div className="relative">
          <img
            src={floor.image}
            alt={`Plano de ${floor.name ?? 'el piso'}`}
            className="block max-h-full max-w-full object-contain"
          />
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
      ) : (
        <p className="p-6 text-center text-body-sm text-(--text-muted)">
          Este piso no tiene plano cargado.
          {doors.length > 0 ? ` Tiene ${doors.length} puerta(s) registradas.` : ''}
        </p>
      )}
    </div>
  );
}
