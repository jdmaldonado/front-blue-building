import { cva, type VariantProps } from 'class-variance-authority';

// Exported on its own so router links (`<Link className={linkVariants()}>`) get
// the same styles without `ui/` having to know about the router.
export const linkVariants = cva(
  [
    'rounded-(--radius-1) underline-offset-2 transition-colors',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
  ],
  {
    variants: {
      tone: {
        accent: 'text-(--accent) hover:text-(--accent-hover) hover:underline',
        muted: 'text-(--text-secondary) hover:text-(--text-primary) hover:underline',
      },
      size: {
        sm: 'text-body-sm',
        md: 'text-body',
      },
    },
    defaultVariants: {
      tone: 'accent',
      size: 'sm',
    },
  },
);

export type LinkVariants = VariantProps<typeof linkVariants>;
