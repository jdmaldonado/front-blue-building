import { cva, type VariantProps } from 'class-variance-authority';

export const loadingLayouts = ['inline', 'block', 'screen'] as const;
export type LoadingLayout = (typeof loadingLayouts)[number];

export const loadingSizes = ['sm', 'md', 'lg'] as const;
export type LoadingSize = (typeof loadingSizes)[number];

export const loadingVariants = cva('flex items-center gap-3 text-(--text-secondary)', {
  variants: {
    layout: {
      inline: '',
      block: 'w-full flex-col justify-center py-10',
      screen: 'min-h-dvh w-full flex-col justify-center',
    },
    size: {
      sm: 'text-label',
      md: 'text-body-sm',
      lg: 'text-body',
    },
  },
  defaultVariants: {
    layout: 'block',
    size: 'md',
  },
});

export type LoadingVariants = VariantProps<typeof loadingVariants>;
