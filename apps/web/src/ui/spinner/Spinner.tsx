import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { spinnerVariants, type SpinnerVariants } from './Spinner-variants';

type SpinnerProps = ComponentProps<'span'> & SpinnerVariants;

export function Spinner({ size, className, ...props }: SpinnerProps) {
  return <span role="status" aria-label="Cargando" className={cn(spinnerVariants({ size }), className)} {...props} />;
}
