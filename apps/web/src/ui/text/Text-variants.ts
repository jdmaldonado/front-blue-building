import { cva, type VariantProps } from 'class-variance-authority';

export const textSizes = [
  'caption',
  'label',
  'body-sm',
  'body',
  'body-lg',
  'title-sm',
  'title',
  'title-lg',
  'display',
  'display-lg',
] as const;
export type TextSize = (typeof textSizes)[number];

export const textTones = ['primary', 'secondary', 'muted', 'inverse', 'accent', 'destructive', 'success'] as const;
export type TextTone = (typeof textTones)[number];

export const textWeights = ['normal', 'medium', 'semibold', 'bold'] as const;
export type TextWeight = (typeof textWeights)[number];

// One place for every piece of text: the size always comes from the scale and
// the color always from a token.
export const textVariants = cva('', {
  variants: {
    size: {
      caption: 'text-caption',
      label: 'text-label',
      'body-sm': 'text-body-sm',
      body: 'text-body',
      'body-lg': 'text-body-lg',
      'title-sm': 'font-display text-title-sm tracking-tight',
      title: 'font-display text-title tracking-tight',
      'title-lg': 'font-display text-title-lg tracking-tight',
      display: 'font-display text-display tracking-tight',
      'display-lg': 'font-display text-display-lg tracking-tight',
    },
    tone: {
      primary: 'text-(--text-primary)',
      secondary: 'text-(--text-secondary)',
      muted: 'text-(--text-muted)',
      inverse: 'text-(--text-inverse)',
      accent: 'text-(--accent)',
      destructive: 'text-(--destructive)',
      success: 'text-(--success)',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  defaultVariants: {
    size: 'body',
    tone: 'primary',
    weight: 'normal',
    truncate: false,
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
