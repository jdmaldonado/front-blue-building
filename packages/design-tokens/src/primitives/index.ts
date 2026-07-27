// Layer 1: raw values with no meaning. Never consumed directly by components.
export const palette = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  gray: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
    950: '#030712',
  },
  red: { 500: '#ef4444', 600: '#dc2626' },
  green: { 500: '#22c55e', 600: '#16a34a' },
  amber: { 500: '#f59e0b' },
} as const;

// Unitless base scale (a 4px/4dp grid). Platform adapters apply the unit:
// web emits rem (value / 16), React Native uses the raw number as dp.
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const fontSize = {
  sm: 14,
  base: 16,
  lg: 18,
  xl: 24,
} as const;
