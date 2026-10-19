import { cn } from '../../../ui';

type PageCornerProps = {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
};

// Literal classes, so Tailwind finds them. The corner square is split on its
// diagonal: the outer half is the gap where the page lifted, the inner half the
// flap. Border colors stand out from the page in both themes.
const SHAPES: Record<PageCornerProps['side'], { gap: string; flap: string; shadow: string }> = {
  right: {
    gap: 'right-0 bg-[linear-gradient(to_top_left,rgb(0_0_0/0.3)_50%,transparent_50%)]',
    flap: '[clip-path:polygon(0_0,100%_0,0_100%)] bg-[linear-gradient(to_top_left,var(--border-default)_30%,var(--text-muted))]',
    shadow: 'drop-shadow-[-2px_-2px_3px_rgb(0_0_0/0.18)]',
  },
  left: {
    gap: 'left-0 bg-[linear-gradient(to_top_right,rgb(0_0_0/0.3)_50%,transparent_50%)]',
    flap: '[clip-path:polygon(0_0,100%_0,100%_100%)] bg-[linear-gradient(to_top_right,var(--border-default)_30%,var(--text-muted))]',
    shadow: 'drop-shadow-[2px_-2px_3px_rgb(0_0_0/0.18)]',
  },
};

// The folded corner of a magazine page: it says the view turns like a page, and
// a tap turns it.
export function PageCorner({ side, label, onClick }: PageCornerProps) {
  const shape = SHAPES[side];

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'absolute bottom-0 size-10 cursor-pointer transition-[width,height] duration-(--duration-fast) ease-standard hover:size-12',
        shape.gap,
      )}
    >
      {/* The shadow sits on a wrapper: on the clipped flap itself it would be cut off. */}
      <span className={cn('absolute inset-0', shape.shadow)}>
        <span className={cn('block size-full', shape.flap)} />
      </span>
    </button>
  );
}
