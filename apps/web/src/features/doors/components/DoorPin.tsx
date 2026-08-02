import type { Door, DoorStatus } from '@bb/core';
import { cn } from '../../../ui';
import { doorStatusMeta } from '../lib';

type DoorPinProps = {
  door: Door;
  status: DoorStatus;
  selected: boolean;
  onSelect: (door: Door) => void;
};

// `left` and `top` are percentages from the API. Only the dot is anchored on
// them: the label hangs to the side, so a door near the edge is still in place.
export function DoorPin({ door, status, selected, onSelect }: DoorPinProps) {
  const meta = doorStatusMeta(status);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(door)}
      style={{ left: `${door.left ?? 50}%`, top: `${door.top ?? 50}%` }}
      className={cn(
        'absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform',
        'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
        selected ? 'z-20 scale-110' : 'z-10',
      )}
    >
      <span className="relative flex size-full items-center justify-center">
        {meta.pulse ? (
          <span className={cn('absolute inline-flex size-full animate-ping rounded-full', meta.pinClassName)} />
        ) : null}
        <span
          className={cn(
            'relative size-4 rounded-full ring-2 ring-black/40',
            meta.pinClassName,
            selected && 'ring-(--accent)',
          )}
        />
      </span>

      <span
        className={cn(
          'absolute top-1/2 left-full ml-2 hidden -translate-y-1/2 items-center rounded-(--radius-round) border px-2.5 py-1',
          'bg-black/60 font-mono text-caption whitespace-nowrap text-white sm:inline-flex',
          selected ? 'border-(--accent)' : 'border-white/15',
        )}
      >
        {door.name ?? door.localId ?? 'Puerta'}
      </span>
    </button>
  );
}
