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

// The header is a strip: the brand block on the left, everything else after it.
// No padding of its own, so the block can reach the edges.
export const dialogHeaderVariants = cva('flex items-stretch border-(--card-border) border-b');

// The block that carries the mark, cut on a diagonal on its trailing edge. It is
// decoration and takes no clicks, so `clip-path` costs nothing here: there is no
// focus ring or shadow to cut off.
export const dialogHeaderMarkVariants = cva(
  [
    'flex flex-none items-center justify-start pr-6 pl-4 sm:pl-5',
    'bg-(--dialog-mark-bg) text-(--dialog-mark-foreground)',
    '[clip-path:polygon(0_0,100%_0,calc(100%-1.25rem)_100%,0_100%)]',
  ].join(' '),
);

export const dialogHeaderContentVariants = cva('flex min-w-0 flex-1 items-start gap-3 px-4 py-4 sm:px-5');

export const dialogBodyVariants = cva('flex-1 overflow-auto px-5 py-4 sm:px-6');

export const dialogFooterVariants = cva(
  'flex flex-col gap-2 border-t border-(--card-border) px-5 py-4 sm:flex-row sm:justify-end sm:px-6',
);

export type DialogVariants = VariantProps<typeof dialogVariants>;
