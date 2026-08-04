import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownMenuAligns = ['start', 'end'] as const;
export type DropdownMenuAlign = (typeof dropdownMenuAligns)[number];

export const dropdownMenuVariants = cva(
  [
    'absolute top-full z-40 mt-1.5 min-w-52 overflow-hidden p-1',
    'rounded-(--menu-radius) border border-(--menu-border) bg-(--menu-bg) shadow-(--shadow-3)',
    'origin-top animate-fade-in',
  ],
  {
    variants: {
      align: {
        start: 'left-0',
        end: 'right-0',
      },
    },
    defaultVariants: {
      align: 'end',
    },
  },
);

export const dropdownMenuItemVariants = cva(
  [
    'flex w-full items-center gap-2.5 rounded-(--radius-1) px-2.5 py-2 text-left text-body-sm',
    'transition-colors duration-(--duration-instant) ease-standard',
    'focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      tone: {
        default: 'text-(--text-primary) hover:bg-(--menu-hover) focus:bg-(--menu-hover)',
        danger: 'text-(--menu-danger-foreground) hover:bg-(--menu-danger-hover) focus:bg-(--menu-danger-hover)',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const dropdownMenuLabelVariants = cva('px-2.5 py-1.5 text-caption tracking-wide text-(--text-muted) uppercase');

export const dropdownMenuSeparatorVariants = cva('my-1 h-px bg-(--menu-border)');

export type DropdownMenuVariants = VariantProps<typeof dropdownMenuVariants>;
