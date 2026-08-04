import { cva, type VariantProps } from 'class-variance-authority';

export const dialogSizes = ['sm', 'md', 'lg', 'xl'] as const;
export type DialogSize = (typeof dialogSizes)[number];

// Uses the native <dialog>, so backdrop, ESC and focus trap are free.
export const dialogVariants = cva(
  [
    'w-full max-h-[85dvh] p-0 backdrop:bg-black/60',
    // Bottom sheet on mobile, centered from sm up. `mx-auto` is explicit
    // because the vertical margins override the browser default.
    'mx-auto mt-auto mb-0 rounded-t-(--card-radius) rounded-b-none',
    'sm:my-auto sm:rounded-(--card-radius)',
    'border border-(--card-border) bg-(--card-bg) text-(--text-primary) shadow-(--shadow-3)',
    // Closed state first, `open:` the visible one and `starting:` where it comes
    // from. `transition-discrete` is what lets an element that appears and
    // disappears from the page animate at all.
    'translate-y-4 opacity-0 transition-[opacity,transform,display,overlay] duration-200 ease-out transition-discrete',
    'open:translate-y-0 open:opacity-100 starting:open:translate-y-4 starting:open:opacity-0',
    'backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:duration-200 backdrop:ease-out',
    'backdrop:transition-discrete open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
  ],
  {
    variants: {
      size: {
        sm: 'sm:max-w-md',
        md: 'sm:max-w-xl',
        lg: 'sm:max-w-3xl',
        xl: 'sm:max-w-5xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const dialogHeaderVariants = cva('flex items-start gap-3 border-b border-(--card-border) px-5 py-4 sm:px-6');

export const dialogBodyVariants = cva('flex-1 overflow-auto px-5 py-4 sm:px-6');

export const dialogFooterVariants = cva(
  'flex flex-col gap-2 border-t border-(--card-border) px-5 py-4 sm:flex-row sm:justify-end sm:px-6',
);

export type DialogVariants = VariantProps<typeof dialogVariants>;
