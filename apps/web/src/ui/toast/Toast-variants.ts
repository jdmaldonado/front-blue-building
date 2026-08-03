import { cva, type VariantProps } from 'class-variance-authority';

export const toastTones = ['info', 'success', 'warning', 'error'] as const;
export type ToastTone = (typeof toastTones)[number];

export const toastVariants = cva(
  [
    'pointer-events-auto flex w-[min(24rem,90vw)] items-start gap-3 rounded-(--card-radius) border p-4',
    'shadow-(--shadow-2)',
  ],
  {
    variants: {
      tone: {
        info: 'border-(--alert-info-border) bg-(--alert-info-bg)',
        success: 'border-(--alert-success-border) bg-(--alert-success-bg)',
        warning: 'border-(--alert-warning-border) bg-(--alert-warning-bg)',
        error: 'border-(--alert-error-border) bg-(--alert-error-bg)',
      },
    },
    defaultVariants: {
      tone: 'info',
    },
  },
);

export const toastTitleVariants = cva('text-body-sm font-semibold', {
  variants: {
    tone: {
      info: 'text-(--alert-info-title)',
      success: 'text-(--alert-success-title)',
      warning: 'text-(--alert-warning-title)',
      error: 'text-(--alert-error-title)',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

export const toastTextVariants = cva('text-body-sm', {
  variants: {
    tone: {
      info: 'text-(--alert-info-text)',
      success: 'text-(--alert-success-text)',
      warning: 'text-(--alert-warning-text)',
      error: 'text-(--alert-error-text)',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

// The stack sits over everything, including native dialogs, so it is a popover.
// `pointer-events-none` keeps the empty area clickable.
export const toastRegionVariants = cva([
  'pointer-events-none inset-auto right-4 bottom-4 m-0 flex flex-col gap-2 border-0 bg-transparent p-0',
]);

export type ToastVariants = VariantProps<typeof toastVariants>;
