import { cva, type VariantProps } from 'class-variance-authority';

export const inputSizes = ['sm', 'md'] as const;
export type InputSize = (typeof inputSizes)[number];

export const inputAppearances = ['plain', 'slanted'] as const;
export type InputAppearance = (typeof inputAppearances)[number];

export const inputVariants = cva(
  [
    'w-full text-(--input-foreground) placeholder:text-(--input-placeholder)',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      appearance: {
        plain: [
          'rounded-(--input-radius) border border-(--input-border) bg-(--input-bg)',
          'focus:border-(--input-border-focus) focus:ring-[3px] focus:ring-(--accent-subtle) focus:outline-none',
          'aria-invalid:border-(--destructive)',
        ],
        // The frame is a sibling behind it, so the field itself stays a plain
        // rectangle: straight caret, straight text, straight focus ring.
        slanted: [
          'peer relative z-10 bg-transparent text-(--input-slanted-foreground)',
          'placeholder:text-(--input-slanted-placeholder) focus:outline-none',
        ],
      },
      inputSize: {
        sm: 'px-3 py-2 text-body sm:text-body-sm',
        md: 'px-3.5 py-2.5 text-body',
      },
    },
    compoundVariants: [
      // The leaning frame crosses 24px in at mid height and further in at the
      // top, so the text starts past that instead of resting on the edge.
      { appearance: 'slanted', inputSize: 'sm', class: 'h-12 px-10 py-0' },
      { appearance: 'slanted', inputSize: 'md', class: 'h-13 px-10 py-0' },
    ],
    defaultVariants: {
      appearance: 'plain',
      inputSize: 'md',
    },
  },
);

// The leaning frame drawn behind a slanted field. It carries the border, so
// focus and error are painted here; it reads them off the input with `peer`.
export const inputSlantVariants = cva([
  'pointer-events-none absolute inset-y-0 right-6 left-6 skew-x-(--slant)',
  'border border-current text-(--input-slanted-border) transition-colors duration-(--duration-fast) ease-standard',
  'peer-focus:text-(--input-slanted-border-focus)',
  'peer-focus:shadow-[0_0_0_3px_var(--input-slanted-ring)]',
  'peer-aria-invalid:text-(--destructive)',
]);

// Holds the field and its frame. The frame is absolute, so the wrapper is what
// gives the row its height.
export const inputFrameVariants = cva('relative isolate flex w-full');

// A line that continues the frame edge past the field, with a ring at its tip.
// It lives inside the leaning frame, so it leans with it; the ring undoes the lean.
export const inputMarkVariants = cva(
  [
    'absolute w-px bg-current',
    'before:absolute before:left-1/2 before:size-2 before:-translate-x-1/2 before:rounded-full',
    'before:border before:border-current before:-skew-x-(--slant)',
  ],
  {
    variants: {
      side: {
        left: '-left-px',
        right: '-right-px',
      },
      end: {
        top: 'bottom-full h-6 before:bottom-full',
        bottom: 'top-full h-3 before:top-full',
      },
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
