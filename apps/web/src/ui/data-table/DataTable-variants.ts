import { cva, type VariantProps } from 'class-variance-authority';

export const dataTableDensities = ['comfortable', 'compact'] as const;
export type DataTableDensity = (typeof dataTableDensities)[number];

export const dataTableFrameVariants = cva(
  'w-full overflow-hidden rounded-(--table-radius) border border-(--table-border) bg-(--card-bg)',
);

// The table scrolls inside its own box, so the page never scrolls sideways.
export const dataTableScrollVariants = cva('w-full overflow-x-auto');

export const dataTableVariants = cva('w-full border-collapse text-left');

export const dataTableHeadCellVariants = cva(
  [
    'bg-(--table-header-bg) px-4 text-caption font-medium tracking-wide text-(--text-secondary) uppercase',
    'border-b border-(--table-border) whitespace-nowrap',
  ],
  {
    variants: {
      density: {
        comfortable: 'py-3',
        compact: 'py-2',
      },
      sortable: {
        true: 'cursor-pointer select-none hover:text-(--text-primary)',
        false: '',
      },
    },
    defaultVariants: {
      density: 'comfortable',
      sortable: false,
    },
  },
);

export const dataTableCellVariants = cva('px-4 align-middle text-body-sm text-(--text-primary)', {
  variants: {
    density: {
      comfortable: 'py-3',
      compact: 'py-2',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export const dataTableRowVariants = cva(
  ['border-b border-(--table-border) transition-colors duration-(--duration-instant) ease-standard', 'last:border-b-0'],
  {
    variants: {
      clickable: {
        true: 'cursor-pointer hover:bg-(--table-row-hover)',
        false: '',
      },
      selected: {
        true: 'bg-(--table-row-selected)',
        false: '',
      },
    },
    defaultVariants: {
      clickable: false,
      selected: false,
    },
  },
);

// Phones get cards instead. A table with eight columns is unreadable there.
export const dataTableCardVariants = cva(
  [
    'flex flex-col gap-2 rounded-(--card-radius) border border-(--card-border) bg-(--card-bg) p-4',
    'transition-colors duration-(--duration-instant) ease-standard',
  ],
  {
    variants: {
      clickable: {
        true: 'cursor-pointer hover:border-(--border-strong)',
        false: '',
      },
      selected: {
        true: 'border-(--accent)',
        false: '',
      },
    },
    defaultVariants: {
      clickable: false,
      selected: false,
    },
  },
);

export const dataTableCardRowVariants = cva('flex items-start justify-between gap-3');
export const dataTableCardLabelVariants = cva('text-caption tracking-wide text-(--text-muted) uppercase');
export const dataTableCardValueVariants = cva('text-right text-body-sm text-(--text-primary)');

export type DataTableVariants = VariantProps<typeof dataTableCellVariants>;
