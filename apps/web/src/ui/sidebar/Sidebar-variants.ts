import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarVariants = cva(
  'flex h-full flex-col border-(--menu-border) border-r bg-(--menu-bg) py-3 transition-[width] duration-200',
  {
    variants: {
      collapsed: {
        true: 'w-16 items-center px-2',
        false: 'w-60 px-3',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarHeaderVariants = cva('flex h-10 flex-none items-center', {
  variants: {
    collapsed: {
      true: 'justify-center',
      false: 'px-1',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const sidebarNavVariants = cva('flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto py-3', {
  variants: {
    collapsed: {
      true: 'items-center',
      false: '',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

// Exported so navigation links keep the router typed where they are used.
export const sidebarItemVariants = cva(
  [
    'flex items-center gap-2.5 rounded-(--radius-2) text-body-sm font-medium transition-colors',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
  ],
  {
    variants: {
      collapsed: {
        true: 'size-10 justify-center',
        false: 'px-2.5 py-2',
      },
      selected: {
        true: 'bg-(--menu-selected-bg) text-(--menu-selected-foreground)',
        false: 'text-(--text-secondary) hover:bg-(--menu-hover) hover:text-(--text-primary)',
      },
    },
    defaultVariants: {
      collapsed: false,
      selected: false,
    },
  },
);

// The label is removed from the tree when collapsed, not just hidden, so the
// icon stays centered.
export const sidebarLabelVariants = cva('min-w-0 flex-1 truncate text-left');

export const sidebarSectionVariants = cva('px-2.5 pt-3 pb-1 text-caption font-medium text-(--text-muted) uppercase', {
  variants: {
    collapsed: {
      true: 'sr-only',
      false: '',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const sidebarFooterVariants = cva('flex-none border-(--menu-border) border-t pt-3');

export type SidebarVariants = VariantProps<typeof sidebarVariants>;
