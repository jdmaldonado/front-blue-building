import { palette } from '../primitives';

// Layer 2: intent. This is the only color layer components should consume.
// Keys are flattened from the design system (surface.base -> surface-base).
export const semanticLight = {
  'surface-base': palette.ink[75],
  'surface-raised': palette.ink[0],
  'surface-sunken': palette.ink[100],
  'surface-inverse': palette.ink[900],

  'text-primary': palette.ink[900],
  'text-secondary': palette.ink[500],
  'text-muted': palette.ink[400],
  'text-on-accent': palette.ink[0],
  'text-inverse': palette.ink[50],

  'border-default': palette.ink[200],
  'border-strong': palette.ink[300],
  'border-focus': palette.cyan[500],

  accent: palette.cyan[500],
  'accent-hover': palette.cyan[600],
  'accent-subtle': palette.cyan[100],

  destructive: palette.red[500],
  'destructive-subtle': 'oklch(0.95 0.025 25)',
  warning: palette.amber[500],
  'warning-subtle': 'oklch(0.95 0.03 80)',
  success: palette.green[500],
  'success-subtle': 'oklch(0.955 0.03 155)',

  'door-open': palette.green[500],
  'door-closed': palette.ink[400],

  'alert-info-bg': palette.cyan[100],
  'alert-info-border': palette.cyan[500],
  'alert-info-title': palette.cyan[500],
  'alert-info-text': 'oklch(0.44 0.09 228)',
  'alert-warning-bg': 'oklch(0.95 0.03 80)',
  'alert-warning-border': palette.amber[500],
  'alert-warning-title': 'oklch(0.50 0.12 70)',
  'alert-warning-text': 'oklch(0.44 0.09 70)',
  'alert-error-bg': 'oklch(0.95 0.025 25)',
  'alert-error-border': palette.red[500],
  'alert-error-title': palette.red[500],
  'alert-error-text': 'oklch(0.45 0.15 25)',
  'alert-success-bg': 'oklch(0.955 0.03 155)',
  'alert-success-border': palette.green[500],
  'alert-success-title': 'oklch(0.46 0.12 155)',
  'alert-success-text': 'oklch(0.40 0.10 155)',

  // Brand surface: stays dark in both themes (the login panel, marketing areas).
  'brand-surface': palette.ink[900],
  'brand-foreground': palette.ink[50],
  'brand-muted': 'oklch(0.86 0.03 235/.8)',
  'brand-accent': palette.cyan[400],
  'brand-gradient': 'linear-gradient(158deg, oklch(0.28 0.06 232/.55), oklch(0.14 0.02 244/.2))',
  // Hairlines and hover states on top of the brand surface. Light ink at low
  // alpha, so they read on the dark panel without becoming a second colour.
  'brand-border': 'oklch(0.86 0.03 235/.18)',
  'brand-hover': 'oklch(0.86 0.03 235/.10)',

  // A second brand surface, saturated instead of dark. Same hue path as the
  // current app (`front/src/components/form.css:14`), cyan to blue, with as much
  // chroma as sRGB holds. The lightness is flat and sits at the brightest point
  // white text still clears 4.5:1 on; the original was brighter but left its own
  // labels at 2.6:1.
  'brand-vivid-surface':
    'linear-gradient(180deg, oklch(0.56 0.094 212) 0%, oklch(0.557 0.104 228) 55%, oklch(0.55 0.127 243) 100%)',
  'brand-vivid-foreground': palette.ink[0],
  'brand-vivid-muted': 'oklch(0.86 0.03 235/.8)',
  'brand-vivid-border': 'oklch(1 0 0/.75)',
  'brand-vivid-ring': 'oklch(1 0 0/.3)',
  'brand-vivid-placeholder': 'oklch(1 0 0/.9)',
  // What sits on the light plate of a button on this surface.
  'brand-vivid-inverse': palette.ink[900],
  // The glow the current app drops under its button (`front/src/components/form.css:105`).
  'brand-glow': '0 10px 30px oklch(0.48 0.09 238/.55)',

  'shadow-1': '0 1px 2px oklch(0.2 0.02 242/.06), 0 2px 8px oklch(0.2 0.02 242/.05)',
  'shadow-2': '0 4px 16px oklch(0.2 0.02 242/.12)',
  'shadow-3': '0 12px 40px oklch(0.2 0.02 242/.18), 0 4px 12px oklch(0.2 0.02 242/.08)',
} as const;

export const semanticDark = {
  'surface-base': palette.ink[950],
  'surface-raised': palette.ink[900],
  'surface-sunken': palette.ink[975],
  'surface-inverse': palette.ink[50],

  'text-primary': palette.ink[50],
  'text-secondary': palette.ink[300],
  'text-muted': palette.ink[500],
  'text-on-accent': palette.ink[975],
  'text-inverse': palette.ink[900],

  'border-default': palette.ink[800],
  'border-strong': palette.ink[600],
  'border-focus': palette.cyan[400],

  accent: palette.cyan[400],
  'accent-hover': palette.cyan[300],
  'accent-subtle': 'oklch(0.26 0.05 224)',

  destructive: palette.red[400],
  'destructive-subtle': 'oklch(0.24 0.06 25)',
  warning: palette.amber[400],
  'warning-subtle': 'oklch(0.24 0.05 80)',
  success: palette.green[400],
  'success-subtle': 'oklch(0.24 0.05 155)',

  'door-open': palette.green[400],
  'door-closed': palette.ink[500],

  'alert-info-bg': 'oklch(0.26 0.05 224)',
  'alert-info-border': palette.cyan[400],
  'alert-info-title': palette.cyan[400],
  'alert-info-text': 'oklch(0.84 0.07 224)',
  'alert-warning-bg': 'oklch(0.24 0.05 80)',
  'alert-warning-border': palette.amber[400],
  'alert-warning-title': palette.amber[400],
  'alert-warning-text': 'oklch(0.86 0.09 80)',
  'alert-error-bg': 'oklch(0.24 0.06 25)',
  'alert-error-border': palette.red[400],
  'alert-error-title': palette.red[400],
  'alert-error-text': 'oklch(0.82 0.10 25)',
  'alert-success-bg': 'oklch(0.24 0.05 155)',
  'alert-success-border': palette.green[400],
  'alert-success-title': palette.green[400],
  'alert-success-text': 'oklch(0.84 0.10 155)',

  // Brand surface: stays dark in both themes (the login panel, marketing areas).
  'brand-surface': palette.ink[900],
  'brand-foreground': palette.ink[50],
  'brand-muted': 'oklch(0.86 0.03 235/.8)',
  'brand-accent': palette.cyan[400],
  'brand-gradient': 'linear-gradient(158deg, oklch(0.28 0.06 232/.55), oklch(0.14 0.02 244/.2))',
  // Hairlines and hover states on top of the brand surface. Light ink at low
  // alpha, so they read on the dark panel without becoming a second colour.
  'brand-border': 'oklch(0.86 0.03 235/.18)',
  'brand-hover': 'oklch(0.86 0.03 235/.10)',

  // A second brand surface, saturated instead of dark. Same hue path as the
  // current app (`front/src/components/form.css:14`), cyan to blue, with as much
  // chroma as sRGB holds. The lightness is flat and sits at the brightest point
  // white text still clears 4.5:1 on; the original was brighter but left its own
  // labels at 2.6:1.
  'brand-vivid-surface':
    'linear-gradient(180deg, oklch(0.56 0.094 212) 0%, oklch(0.557 0.104 228) 55%, oklch(0.55 0.127 243) 100%)',
  'brand-vivid-foreground': palette.ink[0],
  'brand-vivid-muted': 'oklch(0.86 0.03 235/.8)',
  'brand-vivid-border': 'oklch(1 0 0/.75)',
  'brand-vivid-ring': 'oklch(1 0 0/.3)',
  'brand-vivid-placeholder': 'oklch(1 0 0/.9)',
  // What sits on the light plate of a button on this surface.
  'brand-vivid-inverse': palette.ink[900],
  // The glow the current app drops under its button (`front/src/components/form.css:105`).
  'brand-glow': '0 10px 30px oklch(0.48 0.09 238/.55)',

  'shadow-1': '0 1px 2px oklch(0 0 0/.4), 0 2px 8px oklch(0 0 0/.3)',
  'shadow-2': '0 4px 16px oklch(0 0 0/.5)',
  'shadow-3': '0 12px 40px oklch(0 0 0/.6), 0 4px 12px oklch(0 0 0/.4)',
} as const;

export type SemanticToken = keyof typeof semanticLight;
