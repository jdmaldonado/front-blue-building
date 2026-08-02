import type { Door, DoorStatus } from '@bb/core';
import { cn } from '../../../ui';
import { doorStatusMeta } from '../lib';

type DoorPinProps = {
  door: Door;
  status: DoorStatus;
  selected: boolean;
  onSelect: (door: Door) => void;
};

// `left` and `top` are percentages from the API, so the pin follows the plan
// image at any size.
export function DoorPin({ door, status, selected, onSelect }: DoorPinProps) {
  const meta = doorStatusMeta(status);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(door)}
      style={{ left: `${door.left ?? 50}%`, top: `${door.top ?? 50}%` }}
      className={cn(
        'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 transition-transform',
        'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
        selected ? 'z-20 scale-110' : 'z-10',
      )}
    >
      <span className="relative flex size-5 items-center justify-center">
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
          'hidden items-center rounded-(--radius-round) border px-2.5 py-1 font-mono text-caption whitespace-nowrap text-white sm:inline-flex',
          'bg-black/60',
          selected ? 'border-(--accent)' : 'border-white/15',
        )}
      >
        {door.name ?? door.localId ?? 'Puerta'}
      </span>
    </button>
  );
}
