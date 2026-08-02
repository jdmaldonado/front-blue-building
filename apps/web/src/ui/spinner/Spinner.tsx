import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { spinnerVariants, type SpinnerVariants } from './Spinner-variants';

type SpinnerProps = ComponentProps<'span'> & SpinnerVariants;

// Only the mark. The status text belongs to whoever uses it: `Loading` says it
// out loud, `Button` uses aria-busy.
export function Spinner({ size, className, ...props }: SpinnerProps) {
  return <span aria-hidden className={cn(spinnerVariants({ size }), className)} {...props} />;
}
