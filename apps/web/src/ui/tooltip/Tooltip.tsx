import { useId, type ReactNode } from 'react';
import { cn } from '../cn';
import { tooltipVariants, type TooltipVariants } from './Tooltip-variants';

type TooltipProps = TooltipVariants & {
  // Short text. A tooltip is a hint, never the only place where something is
  // explained: it does not exist on touch screens.
  content: string;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ content, side, children, className }: TooltipProps) {
  const id = useId();

  return (
    <span className={cn('group relative inline-flex', className)} aria-describedby={id}>
      {children}
      <span role="tooltip" id={id} className={tooltipVariants({ side })}>
        {content}
      </span>
    </span>
  );
}
