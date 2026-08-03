import { cva, type VariantProps } from 'class-variance-authority';

export const drawerSides = ['left', 'right'] as const;
export type DrawerSide = (typeof drawerSides)[number];

// Native <dialog> again, so backdrop, ESC and focus trap are free. The margins
// are set one by one because the browser centers the dialog by default.
//
// The classes without `open:` describe the closed panel, `open:` the visible
// one, and `starting:` where it comes from the first time it is shown. Without
// `transition-discrete` the browser cannot animate an element that appears and
// disappears from the page.
export const drawerVariants = cva(
  [
    'h-dvh max-h-none w-[min(18rem,85vw)] max-w-none p-0',
    'my-0 border-(--card-border) bg-(--card-bg) text-(--text-primary) shadow-(--shadow-3)',
    'opacity-0 transition-[opacity,transform,display,overlay] duration-300 ease-out transition-discrete',
    'open:opacity-100 starting:open:opacity-0',
    'backdrop:bg-black/60 backdrop:opacity-0 backdrop:transition-[opacity,display,overlay]',
    'backdrop:duration-300 backdrop:ease-out backdrop:transition-discrete',
    'open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
  ],
  {
    variants: {
      side: {
        left: 'mr-auto ml-0 -translate-x-full border-r open:translate-x-0 starting:open:-translate-x-full',
        right: 'mr-0 ml-auto translate-x-full border-l open:translate-x-0 starting:open:translate-x-full',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
);

export type DrawerVariants = VariantProps<typeof drawerVariants>;
