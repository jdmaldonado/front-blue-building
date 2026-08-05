import { cva, type VariantProps } from 'class-variance-authority';

export const selectSizes = ['sm', 'md'] as const;
export type SelectSize = (typeof selectSizes)[number];

export const selectVariants = cva(
  [
    'w-full appearance-none rounded-(--input-radius) border border-(--input-border) bg-(--input-bg) text-(--input-foreground)',
    'pr-9',
    'focus:border-(--input-border-focus) focus:ring-[3px] focus:ring-(--accent-subtle) focus:outline-none',
    'cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      selectSize: {
        sm: 'py-2 pl-3 text-field sm:text-body-sm',
        md: 'py-2.5 pl-3.5 text-field sm:text-body',
      },
    },
    defaultVariants: {
      selectSize: 'md',
    },
  },
);

export type SelectVariants = VariantProps<typeof selectVariants>;
