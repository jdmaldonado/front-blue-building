import type { ReactNode } from 'react';
import { cn } from '../cn';
import { breadcrumbVariants } from './Breadcrumb-variants';

type BreadcrumbProps = {
  // Read out to screen readers, for example "Ruta de navegación".
  label: string;
  children: ReactNode;
  className?: string;
};

// Only the shell. The crumbs are links of the router, so whoever knows the
// routes builds them and this keeps the shape and the semantics.
export function Breadcrumb({ label, children, className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cn('min-w-0', className)}>
      <ol className={breadcrumbVariants()}>{children}</ol>
    </nav>
  );
}
