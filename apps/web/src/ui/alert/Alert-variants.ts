import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariantNames = ['info', 'warning', 'error', 'success'] as const;
export type AlertVariant = (typeof alertVariantNames)[number];

export const alertVariants = cva('flex gap-3 rounded-(--input-radius) border p-4', {
  variants: {
    variant: {
      info: 'bg-(--alert-info-bg) border-(--alert-info-border)',
      warning: 'bg-(--alert-warning-bg) border-(--alert-warning-border)',
      error: 'bg-(--alert-error-bg) border-(--alert-error-border)',
      success: 'bg-(--alert-success-bg) border-(--alert-success-border)',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const alertTitleVariants = cva('text-body font-semibold', {
  variants: {
    variant: {
      info: 'text-(--alert-info-title)',
      warning: 'text-(--alert-warning-title)',
      error: 'text-(--alert-error-title)',
      success: 'text-(--alert-success-title)',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const alertTextVariants = cva('text-body-sm', {
  variants: {
    variant: {
      info: 'text-(--alert-info-text)',
      warning: 'text-(--alert-warning-text)',
      error: 'text-(--alert-error-text)',
      success: 'text-(--alert-success-text)',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export type AlertVariants = VariantProps<typeof alertVariants>;
