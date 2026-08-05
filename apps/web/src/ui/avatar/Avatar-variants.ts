import { cva, type VariantProps } from 'class-variance-authority';

export const avatarSizes = ['sm', 'md', 'lg'] as const;
export type AvatarSize = (typeof avatarSizes)[number];

export const avatarVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-(--avatar-radius)',
    'bg-(--avatar-bg) font-medium text-(--avatar-foreground) uppercase',
  ],
  {
    variants: {
      size: {
        sm: 'size-7 text-caption',
        md: 'size-9 text-label',
        lg: 'size-12 text-body',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type AvatarVariants = VariantProps<typeof avatarVariants>;
