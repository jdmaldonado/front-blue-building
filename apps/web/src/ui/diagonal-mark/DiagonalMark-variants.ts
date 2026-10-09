import { cva, type VariantProps } from 'class-variance-authority';

export const diagonalMarkSizes = ['sm', 'md', 'lg', 'xl'] as const;
export type DiagonalMarkSize = (typeof diagonalMarkSizes)[number];

// Decoration only. The line and the dots paint with `currentColor`, so the size
// is the only thing that changes here and the tone comes from the token.
export const diagonalMarkVariants = cva('pointer-events-none text-(--diagonal-mark-line)', {
  variants: {
    size: {
      sm: 'w-6 h-12',
      md: 'w-8 h-16',
      lg: 'w-10 h-20',
      xl: 'w-16 h-32',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type DiagonalMarkVariants = VariantProps<typeof diagonalMarkVariants>;
