import { cn } from '../../../ui';

type PageDotsProps = {
  count: number;
  current: number;
  className?: string;
};

// Like the dots under a photo carousel: they hint that the view swipes sideways.
// Only a hint, so screen readers skip it; the tabs already say where you are.
export function PageDots({ count, current, className }: PageDotsProps) {
  return (
    <div aria-hidden className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-1.5 rounded-(--radius-round) transition-[width,background-color] duration-(--duration-base) ease-standard',
            index === current ? 'w-5 bg-(--accent)' : 'w-1.5 bg-(--border-strong)',
          )}
        />
      ))}
    </div>
  );
}
