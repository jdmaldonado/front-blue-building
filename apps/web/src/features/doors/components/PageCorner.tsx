import { cn } from '../../../ui';

type PageCornerProps = {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
};

// The square is split on its diagonal: the outer half is the gap where the page
// lifted, the inner half the flap. Border colors stand out in both themes.
const SHAPES: Record<PageCornerProps['side'], { gap: string; flap: string; shadow: string }> = {
  right: {
    gap: 'right-0 bg-linear-to-tl from-black/30 from-50% to-transparent to-50%',
    flap: '[clip-path:polygon(0_0,100%_0,0_100%)] bg-linear-to-tl from-(--border-default) from-30% to-(--text-muted)',
    shadow: 'drop-shadow-md',
  },
  left: {
    gap: 'left-0 bg-linear-to-tr from-black/30 from-50% to-transparent to-50%',
    flap: '[clip-path:polygon(0_0,100%_0,100%_100%)] bg-linear-to-tr from-(--border-default) from-30% to-(--text-muted)',
    shadow: 'drop-shadow-md',
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
        'absolute bottom-0 size-11 cursor-pointer transition-[width,height] duration-(--duration-fast) ease-standard hover:size-13',
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
