import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { cardVariants, type CardVariants } from './Card-variants';

type CardProps = ComponentProps<'div'> & CardVariants;

export function Card({ elevation, padding, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ elevation, padding }), className)} {...props} />;
}
