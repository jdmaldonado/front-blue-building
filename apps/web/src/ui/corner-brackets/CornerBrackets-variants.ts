import { cva, type VariantProps } from 'class-variance-authority';

export const cornerBracketTones = ['accent', 'muted'] as const;
export type CornerBracketTone = (typeof cornerBracketTones)[number];

export const cornerBracketCorners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
export type CornerBracketCorner = (typeof cornerBracketCorners)[number];

// Four L marks on the corners of the frame it sits in. The parent has to be
// positioned. The tone is set once here and the marks take it from
// `currentColor`, so a corner never drifts from the others.
export const cornerBracketsVariants = cva('pointer-events-none absolute inset-0 z-10', {
  variants: {
    tone: {
      accent: 'text-(--corner-bracket-line)',
      muted: 'text-(--corner-bracket-line-muted)',
    },
  },
  defaultVariants: {
    tone: 'accent',
  },
});

export const cornerBracketMarkVariants = cva('absolute size-4 border-current', {
  variants: {
    corner: {
      'top-left': 'top-0 left-0 border-t-2 border-l-2',
      'top-right': 'top-0 right-0 border-t-2 border-r-2',
      'bottom-left': 'bottom-0 left-0 border-b-2 border-l-2',
      'bottom-right': 'right-0 bottom-0 border-r-2 border-b-2',
    },
  },
});

export type CornerBracketsVariants = VariantProps<typeof cornerBracketsVariants>;
