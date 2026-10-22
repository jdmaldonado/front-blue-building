import { cva, type VariantProps } from 'class-variance-authority';

export const selectSizes = ['sm', 'md'] as const;
export type SelectSize = (typeof selectSizes)[number];

export const selectAppearances = ['plain', 'slanted'] as const;
export type SelectAppearance = (typeof selectAppearances)[number];

export const selectVariants = cva(
  ['w-full appearance-none pr-9', 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'],
  {
    variants: {
      appearance: {
        plain: [
          'rounded-(--input-radius) border border-(--input-border) bg-(--input-bg) text-(--input-foreground)',
          'focus:border-(--input-border-focus) focus:ring-[3px] focus:ring-(--accent-subtle) focus:outline-none',
        ],
        // Same trick as the slanted field: the frame is a sibling behind it.
        slanted: 'peer relative z-10 bg-transparent text-(--input-slanted-foreground) focus:outline-none',
      },
      selectSize: {
        sm: 'py-2 pl-3 text-body sm:text-body-sm',
        md: 'py-2.5 pl-3.5 text-body',
      },
    },
    compoundVariants: [
      { appearance: 'slanted', selectSize: 'sm', class: 'h-12 py-0 pl-10' },
      { appearance: 'slanted', selectSize: 'md', class: 'h-13 py-0 pl-10' },
    ],
    defaultVariants: {
      appearance: 'plain',
      selectSize: 'md',
    },
  },
);

export type SelectVariants = VariantProps<typeof selectVariants>;
