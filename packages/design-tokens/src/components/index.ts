import type { PatternToken, RadiusToken } from '../primitives';
import type { SemanticToken } from '../semantic';

// A component token aliases a semantic role, a primitive dimension, or one of
// the decorative patterns.
type RadiusRef = `radius-${RadiusToken}`;
type PatternRef = `pattern-${PatternToken}`;
type ComponentRef = SemanticToken | RadiusRef | PatternRef;

// Layer 3: component-level tokens. Each one points at a semantic role (color) or
// a primitive dimension, so the CSS output becomes `--button-primary-bg: var(--accent)`.
export const componentTokens = {
  // The brand in the dialog is one small block with the mark, cut on a diagonal,
  // the way the old modals did it. Everything else in the header stays quiet.
  'dialog-mark-bg': 'accent',
  'dialog-mark-foreground': 'text-on-accent',

  // Button: 4 intents x 3 appearances. `bg`/`bg-hover`/`foreground` resolve the
  // solid fill; `text`/`border`/`soft` resolve outline and ghost (text = label on
  // transparent, border = outline stroke, soft = hover fill).
  'button-primary-bg': 'accent',
  'button-primary-bg-hover': 'accent-hover',
  'button-primary-foreground': 'text-on-accent',
  'button-primary-text': 'accent',
  'button-primary-border': 'accent',
  'button-primary-soft': 'accent-subtle',

  'button-neutral-bg': 'border-default',
  'button-neutral-bg-hover': 'border-strong',
  'button-neutral-foreground': 'text-primary',
  'button-neutral-text': 'text-primary',
  'button-neutral-border': 'border-strong',
  'button-neutral-soft': 'surface-sunken',

  'button-destructive-bg': 'destructive',
  'button-destructive-bg-hover': 'destructive',
  'button-destructive-foreground': 'text-on-accent',
  'button-destructive-text': 'destructive',
  'button-destructive-border': 'destructive',
  'button-destructive-soft': 'destructive-subtle',

  'button-success-bg': 'success',
  'button-success-bg-hover': 'success',
  'button-success-foreground': 'text-on-accent',
  'button-success-text': 'success',
  'button-success-border': 'success',
  'button-success-soft': 'success-subtle',

  'button-warning-bg': 'warning',
  'button-warning-bg-hover': 'warning',
  'button-warning-foreground': 'text-on-accent',
  'button-warning-text': 'warning',
  'button-warning-border': 'warning',
  'button-warning-soft': 'warning-subtle',

  'button-radius': 'radius-2',

  'badge-live-foreground': 'destructive',
  'badge-radius': 'radius-1',

  'input-bg': 'surface-raised',
  'input-border': 'border-default',
  'input-border-focus': 'border-focus',
  'input-foreground': 'text-primary',
  'input-placeholder': 'text-muted',
  'input-radius': 'radius-2',

  'card-bg': 'surface-raised',
  'card-border': 'border-default',
  'card-radius': 'radius-3',

  'status-dot-online': 'success',
  'status-dot-offline': 'door-closed',
  'status-dot-alert': 'destructive',
  'status-dot-warning': 'warning',
  'status-dot-unknown': 'text-muted',

  'radio-border': 'border-strong',
  'radio-border-checked': 'accent',
  'radio-dot': 'accent',
  // The segmented track is chrome, so it squares off. The radio itself stays a
  // circle: a square one reads as a checkbox.
  'radio-track-radius': 'radius-1',

  'checkbox-border': 'border-strong',
  'checkbox-bg-checked': 'accent',
  'checkbox-foreground': 'text-on-accent',

  'toggle-track-off': 'surface-sunken',
  'toggle-track-on': 'accent',
  'toggle-knob': 'surface-raised',
  'toggle-border': 'border-strong',
  'toggle-track-radius': 'radius-1',

  'tab-foreground': 'text-secondary',
  'tab-foreground-active': 'text-primary',
  'tab-indicator': 'accent',
  'tab-radius': 'radius-1',

  'menu-bg': 'surface-raised',
  'menu-border': 'border-default',
  'menu-hover': 'surface-sunken',
  'menu-selected-bg': 'accent-subtle',
  'menu-selected-foreground': 'accent',
  'menu-radius': 'radius-2',
  'menu-danger-foreground': 'destructive',
  'menu-danger-hover': 'destructive-subtle',

  // The resident menu on a phone: a brand panel, the same family as the login.
  'menu-panel-bg': 'brand-surface',
  'menu-panel-gradient': 'brand-gradient',
  'menu-panel-foreground': 'brand-foreground',
  'menu-panel-muted': 'brand-muted',
  'menu-panel-accent': 'brand-accent',
  'menu-panel-border': 'brand-border',
  'menu-panel-hover': 'brand-hover',

  'table-header-bg': 'surface-sunken',
  'table-row-hover': 'surface-sunken',
  'table-row-selected': 'accent-subtle',
  'table-border': 'border-default',
  'table-radius': 'radius-3',

  // Skeletons: a flat base with a lighter band travelling across it.
  'skeleton-bg': 'surface-sunken',
  'skeleton-shine': 'surface-raised',

  'tooltip-bg': 'surface-inverse',
  'tooltip-foreground': 'text-inverse',
  'tooltip-radius': 'radius-1',

  // The line that travels while a reader waits for a card.
  'scan-line': 'accent',

  'avatar-bg': 'accent-subtle',
  'avatar-foreground': 'accent',
  'avatar-radius': 'radius-1',

  'icon-button-foreground': 'text-secondary',
  'icon-button-bg-hover': 'surface-sunken',
  'icon-button-radius': 'radius-1',

  // Four L marks on the corners of a frame. Reads as an instrument, not a card.
  'corner-bracket-line': 'accent',
  'corner-bracket-line-muted': 'border-strong',
} as const satisfies Record<string, ComponentRef>;

export type ComponentToken = keyof typeof componentTokens;
