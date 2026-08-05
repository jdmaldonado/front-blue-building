import { cva, type VariantProps } from 'class-variance-authority';

export const drawerSides = ['left', 'right'] as const;
export type DrawerSide = (typeof drawerSides)[number];

export const drawerSizes = ['panel', 'full'] as const;
export type DrawerSize = (typeof drawerSizes)[number];

// Native <dialog> again, so backdrop, ESC and focus trap are free. The margins
// are set one by one because the browser centers the dialog by default.
//
// The classes without `open:` describe the closed panel, `open:` the visible
// one, and `starting:` where it comes from the first time it is shown. Without
// `transition-discrete` the browser cannot animate an element that appears and
// disappears from the page.
export const drawerVariants = cva(
  [
    'h-dvh max-h-none max-w-none p-0',
    'my-0 border-(--card-border) bg-(--card-bg) text-(--text-primary) shadow-(--shadow-3)',
    'opacity-0 transition-[opacity,transform,display,overlay] duration-(--duration-slow) ease-standard transition-discrete',
    'open:opacity-100 starting:open:opacity-0',
    'backdrop:bg-black/60 backdrop:opacity-0 backdrop:transition-[opacity,display,overlay]',
    'backdrop:duration-(--duration-slow) backdrop:ease-standard backdrop:transition-discrete',
    'open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
  ],
  {
    variants: {
      side: {
        left: 'mr-auto ml-0 -translate-x-full border-r open:translate-x-0 starting:open:-translate-x-full',
        right: 'mr-0 ml-auto translate-x-full border-l open:translate-x-0 starting:open:translate-x-full',
      },
      size: {
        panel: 'w-[min(18rem,85vw)]',
        // Takes the whole screen, so there is no edge to show a border on.
        full: 'w-full border-0',
      },
    },
    defaultVariants: {
      side: 'left',
      size: 'panel',
    },
  },
);

export type DrawerVariants = VariantProps<typeof drawerVariants>;
