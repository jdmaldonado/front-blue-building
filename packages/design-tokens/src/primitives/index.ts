// Layer 1: raw values with no meaning. Never consumed directly by components.
// Colors are oklch (browser-native). React Native has no oklch parser, so the
// future RN adapter must convert oklch->rgb; web consumes these strings as-is.
export const palette = {
  cyan: {
    100: 'oklch(0.95 0.03 215)',
    200: 'oklch(0.89 0.06 215)',
    300: 'oklch(0.80 0.10 213)',
    400: 'oklch(0.72 0.13 215)',
    500: 'oklch(0.60 0.125 224)',
    600: 'oklch(0.50 0.105 228)',
    700: 'oklch(0.40 0.085 232)',
  },
  ink: {
    0: 'oklch(0.99 0.003 235)',
    50: 'oklch(0.972 0.005 235)',
    100: 'oklch(0.93 0.008 235)',
    200: 'oklch(0.865 0.012 235)',
    300: 'oklch(0.72 0.015 235)',
    400: 'oklch(0.55 0.02 236)',
    500: 'oklch(0.45 0.025 238)',
    600: 'oklch(0.35 0.03 240)',
    700: 'oklch(0.29 0.032 240)',
    800: 'oklch(0.225 0.03 242)',
    900: 'oklch(0.175 0.025 242)',
    950: 'oklch(0.14 0.02 244)',
    975: 'oklch(0.11 0.017 244)',
  },
  red: {
    400: 'oklch(0.68 0.16 25)',
    500: 'oklch(0.56 0.17 25)',
  },
  amber: {
    400: 'oklch(0.78 0.14 80)',
    500: 'oklch(0.66 0.13 70)',
  },
  green: {
    400: 'oklch(0.72 0.14 155)',
    500: 'oklch(0.58 0.13 155)',
  },
} as const;

export const font = {
  display: "'Space Grotesk', sans-serif",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

// Unitless base scale (a 4px/4dp grid). Platform adapters apply the unit:
// web emits rem (value / 16), React Native uses the raw number as dp.
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
} as const;

export const radius = {
  1: 6,
  2: 10,
  3: 16,
  round: 999,
} as const;

export type RadiusToken = keyof typeof radius;

export const fontSize = {
  sm: 14,
  base: 16,
  lg: 18,
  xl: 24,
} as const;
