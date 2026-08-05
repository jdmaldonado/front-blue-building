import { useId, type ReactNode } from 'react';
import { cn } from '../cn';
import { tooltipVariants, type TooltipVariants } from './Tooltip-variants';

type TooltipProps = TooltipVariants & {
  // A tooltip is only a hint: it does not exist on touch screens.
  content: string;
  // The child already carries this same text as its accessible name, so the
  // bubble is decoration and repeating it would make a screen reader say it
  // twice.
  decorative?: boolean;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ content, side, decorative = false, children, className }: TooltipProps) {
  const id = useId();

  return (
    <span className={cn('group relative inline-flex', className)} aria-describedby={decorative ? undefined : id}>
      {children}
      <span
        role={decorative ? undefined : 'tooltip'}
        aria-hidden={decorative ? true : undefined}
        id={decorative ? undefined : id}
        className={tooltipVariants({ side })}
      >
        {content}
      </span>
    </span>
  );
}
