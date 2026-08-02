import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { linkVariants, type LinkVariants } from './Link-variants';

// Plain anchor, for links out of the app. Inside the app use the router's `Link`
// with `className={linkVariants()}`.
type LinkProps = ComponentProps<'a'> & LinkVariants & { ref?: Ref<HTMLAnchorElement> };

export function Link({ tone, size, className, ...props }: LinkProps) {
  return <a className={cn(linkVariants({ tone, size }), className)} {...props} />;
}
