import { cva } from 'class-variance-authority';

export const breadcrumbVariants = cva('flex min-w-0 items-center gap-1 text-caption');

export const breadcrumbItemVariants = cva('flex min-w-0 items-center gap-1');

export const breadcrumbLinkVariants = cva(
  [
    'truncate text-(--text-muted) transition-colors duration-(--duration-fast) ease-standard',
    'hover:text-(--text-primary)',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
  ].join(' '),
);

export const breadcrumbSeparatorVariants = cva('flex-none text-(--text-muted)');
