import { cva, type VariantProps } from 'class-variance-authority';

export const statusDotStates = ['online', 'offline', 'alert', 'warning', 'unknown'] as const;
export type StatusDotState = (typeof statusDotStates)[number];

export const statusDotVariants = cva('inline-block shrink-0 rounded-(--radius-round)', {
  variants: {
    state: {
      online: 'bg-(--status-dot-online)',
      offline: 'bg-(--status-dot-offline)',
      alert: 'bg-(--status-dot-alert)',
      warning: 'bg-(--status-dot-warning)',
      unknown: 'bg-(--status-dot-unknown)',
    },
    size: {
      sm: 'size-1.5',
      md: 'size-2',
      lg: 'size-2.5',
    },
    // `breathe` for something alive and idle, `pulse` for something asking for
    // attention. Only one of them ever runs.
    motion: {
      none: '',
      breathe: 'animate-breathe',
      pulse: 'animate-pulse',
    },
  },
  defaultVariants: {
    state: 'unknown',
    size: 'md',
    motion: 'none',
  },
});

// The halo repeats the dot color behind it, so an alert reads from far away.
export const statusDotHaloVariants = cva('absolute inset-0 rounded-(--radius-round) opacity-40 animate-ping', {
  variants: {
    state: {
      online: 'bg-(--status-dot-online)',
      offline: 'bg-(--status-dot-offline)',
      alert: 'bg-(--status-dot-alert)',
      warning: 'bg-(--status-dot-warning)',
      unknown: 'bg-(--status-dot-unknown)',
    },
  },
  defaultVariants: {
    state: 'unknown',
  },
});

export type StatusDotVariants = VariantProps<typeof statusDotVariants>;
