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
    75: 'oklch(0.955 0.012 238)',
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

// Square by decision, not by accident: the brand leans on hard corners. The
// three steps stay so the scale can be turned back on from one place, and
// `round` is reserved for what is a circle by nature: dots, knobs, portraits.
export const radius = {
  1: 0,
  2: 0,
  3: 0,
  round: 999,
} as const;

export type RadiusToken = keyof typeof radius;

// Motion, by role. Durations are milliseconds on every platform.
// `instant` is for state that must feel immediate (hover, focus). `slow` and
// `slower` are for things that repeat by themselves (scan lines, breathing
// dots): fast loops read as noise.
export const duration = {
  instant: 90,
  fast: 150,
  base: 220,
  slow: 380,
  slower: 700,
} as const;

export type DurationToken = keyof typeof duration;

export const easing = {
  // Everything that stays on screen and just moves or resizes.
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  // Things coming in: slow start, soft landing.
  enter: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  // Things leaving: quick exit, nobody waits for them.
  exit: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
} as const;

export type EasingToken = keyof typeof easing;

// Type scale by role, not by raw size. A component picks the role ("this is a
// label", "this is the page title") and the scale decides the number, so nobody
// writes `text-[23px]` again. Sizes are px; the web adapter converts to rem.
export const typeScale = {
  caption: { size: 11, lineHeight: 1.45 },
  label: { size: 12, lineHeight: 1.45 },
  'body-sm': { size: 13, lineHeight: 1.5 },
  body: { size: 14, lineHeight: 1.5 },
  'body-lg': { size: 15, lineHeight: 1.5 },
  // Form controls on a phone. Under 16px Safari zooms the page the moment the
  // field takes focus, and the layout jumps.
  field: { size: 16, lineHeight: 1.5 },
  'title-sm': { size: 17, lineHeight: 1.35 },
  title: { size: 20, lineHeight: 1.3 },
  'title-lg': { size: 23, lineHeight: 1.25 },
  display: { size: 28, lineHeight: 1.15 },
  'display-lg': { size: 36, lineHeight: 1.1 },
} as const;

export type TypeScaleToken = keyof typeof typeScale;

// Families are self-hosted (@fontsource) so the PWA works offline and no request
// leaves the origin. The web adapter registers them in Tailwind's theme; React
// Native will load the same families through its own font loader.
export const fontFamily = {
  display: "'Space Grotesk Variable', sans-serif",
  body: "'IBM Plex Sans Variable', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

export type FontFamilyToken = keyof typeof fontFamily;

// Decorative honeycomb, the brand's recurring motif. Tile is 39 x 22.52.
// The stroke colour decides where it reads, so there is one version per surface:
// white for dark panels, brand blue for light ones.
function honeycombSvg(stroke: string, opacity: string): string {
  return (
    "<svg xmlns='http://www.w3.org/2000/svg' width='39' height='22.52' viewBox='0 0 39 22.52'>" +
    `<g fill='none' stroke='${stroke}' stroke-opacity='${opacity}' stroke-width='1'>` +
    "<polygon points='13.00,0.00 6.50,11.26 -6.50,11.26 -13.00,0.00 -6.50,-11.26 6.50,-11.26'/>" +
    "<polygon points='13.00,22.52 6.50,33.77 -6.50,33.77 -13.00,22.52 -6.50,11.26 6.50,11.26'/>" +
    "<polygon points='52.00,0.00 45.50,11.26 32.50,11.26 26.00,0.00 32.50,-11.26 45.50,-11.26'/>" +
    "<polygon points='52.00,22.52 45.50,33.77 32.50,33.77 26.00,22.52 32.50,11.26 45.50,11.26'/>" +
    "<polygon points='32.50,11.26 26.00,22.52 13.00,22.52 6.50,11.26 13.00,0.00 26.00,0.00'/>" +
    "<polygon points='32.50,-11.26 26.00,0.00 13.00,0.00 6.50,-11.26 13.00,-22.52 26.00,-22.52'/>" +
    "<polygon points='32.50,33.77 26.00,45.03 13.00,45.03 6.50,33.77 13.00,22.52 26.00,22.52'/>" +
    '</g></svg>'
  );
}

// Hex, not oklch: the pattern travels inside a data URI and a colour with
// spaces and parentheses would have to be escaped. This is cyan[500] in sRGB.
const HONEYCOMB_BRAND_STROKE = '%230e85b0';

export const pattern = {
  honeycomb: `url("data:image/svg+xml,${honeycombSvg('%23ffffff', '0.08')}")`,
  // For light surfaces, where the white one is invisible. Kept because the
  // system needs it the day something light wants texture.
  'honeycomb-brand': `url("data:image/svg+xml,${honeycombSvg(HONEYCOMB_BRAND_STROKE, '0.07')}")`,
} as const;

export type PatternToken = keyof typeof pattern;

// Named loops the interface can reuse. Each one has a meaning:
// scan   -> a reader is waiting for a card to be tapped
// sweep  -> a device is busy and we cannot see inside (reboot, config sent)
// shimmer-> content is loading (skeletons)
// breathe-> something is alive but idle (online dot)
// The keyframes live next to the names so both travel together.
export const animation = {
  // Runs once, when a panel appears (menus, popovers).
  'fade-in': { value: 'fade-in 150ms cubic-bezier(0.05, 0.7, 0.1, 1)' },
  scan: { value: 'scan 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
  sweep: { value: 'sweep 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
  shimmer: { value: 'shimmer 1.6s linear infinite' },
  breathe: { value: 'breathe 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
} as const;

export type AnimationToken = keyof typeof animation;

export const keyframes = {
  'fade-in': {
    from: 'opacity: 0; transform: translateY(-4px) scale(0.98);',
    to: 'opacity: 1; transform: translateY(0) scale(1);',
  },
  scan: {
    '0%': 'transform: translateY(-100%); opacity: 0;',
    '10%, 90%': 'opacity: 1;',
    '100%': 'transform: translateY(400%); opacity: 0;',
  },
  sweep: {
    '0%': 'transform: translateX(-100%);',
    '100%': 'transform: translateX(200%);',
  },
  shimmer: {
    '0%': 'background-position: 100% 0;',
    '100%': 'background-position: -100% 0;',
  },
  breathe: {
    '0%, 100%': 'opacity: 1; transform: scale(1);',
    '50%': 'opacity: 0.55; transform: scale(0.88);',
  },
} as const;

export const PATTERN_TILE_SIZE = '39px 22.52px';
