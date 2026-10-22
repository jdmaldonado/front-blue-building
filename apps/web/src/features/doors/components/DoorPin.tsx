import type { Door, DoorStatus } from '@bb/core';
import { Text, cn } from '../../../ui';
import { doorStatusMeta, preferredLabelSide, type LabelSide } from '../lib';

const PLAN_MIDDLE_PERCENT = 50;

const labelPlacement: Record<LabelSide, string> = {
  left: 'top-1/2 right-full mr-1.5 -translate-y-1/2 sm:mr-2',
  right: 'top-1/2 left-full ml-1.5 -translate-y-1/2 sm:ml-2',
  top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2 sm:mb-2',
  bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2 sm:mt-2',
};

type DoorPinProps = {
  door: Door;
  status: DoorStatus;
  selected: boolean;
  // Chosen by the plan, which sees the other labels. Until then, the preferred one.
  labelSide?: LabelSide;
  onSelect: (door: Door) => void;
};

// `left` and `top` are percentages from the API. Only the dot is anchored on
// them: the label hangs to the side, so a door near the edge is still in place.
export function DoorPin({ door, status, selected, labelSide, onSelect }: DoorPinProps) {
  const meta = doorStatusMeta(status);
  const preferred = preferredLabelSide(door);
  const side = labelSide ?? preferred;

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-pin={door.id}
      data-preferred={preferred}
      onClick={() => onSelect(door)}
      style={{ left: `${door.left ?? PLAN_MIDDLE_PERCENT}%`, top: `${door.top ?? PLAN_MIDDLE_PERCENT}%` }}
      className={cn(
        'absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full transition-transform',
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
            'relative size-4 rounded-full shadow-(--shadow-2) ring-2 ring-white',
            meta.pinClassName,
            selected && 'ring-(--accent)',
          )}
        />
      </span>

      <Text
        as="span"
        size="caption"
        tone="inherit"
        data-pin-label
        data-side={side}
        className={cn(
          'absolute inline-flex w-max max-w-36 items-center rounded-(--radius-2) border sm:max-w-56',
          'px-1.5 py-0.5 sm:px-2.5 sm:py-1',
          'bg-black/80 leading-tight text-white shadow-(--shadow-2)',
          labelPlacement[side],
          selected ? 'border-(--accent)' : 'border-white/30',
        )}
      >
        {door.name ?? door.localId ?? 'Puerta'}
      </Text>
    </button>
  );
}
