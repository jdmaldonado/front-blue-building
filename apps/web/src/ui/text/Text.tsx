import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { textVariants, type TextVariants } from './Text-variants';

// Which tag to render. The look comes from `size`, so a heading can be small
// and a paragraph can be big without lying about the structure of the page.
const textElements = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'strong'] as const;
export type TextElement = (typeof textElements)[number];

type TextProps = ComponentProps<'p'> &
  TextVariants & {
    as?: TextElement;
  };

export function Text({ as: Component = 'p', size, tone, weight, truncate, className, ...props }: TextProps) {
  return <Component className={cn(textVariants({ size, tone, weight, truncate }), className)} {...props} />;
}
