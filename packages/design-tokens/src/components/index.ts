import type { RadiusToken } from '../primitives';
import type { SemanticToken } from '../semantic';

// A component token aliases either a semantic role or a primitive dimension var.
type RadiusRef = `radius-${RadiusToken}`;
type ComponentRef = SemanticToken | RadiusRef;

// Layer 3: component-level tokens. Each one points at a semantic role (color) or
// a primitive dimension, so the CSS output becomes `--button-primary-bg: var(--accent)`.
export const componentTokens = {
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

  'button-radius': 'radius-2',

  'badge-live-foreground': 'destructive',

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

  'radio-border': 'border-strong',
  'radio-border-checked': 'accent',
  'radio-dot': 'accent',

  'checkbox-border': 'border-strong',
  'checkbox-bg-checked': 'accent',
  'checkbox-foreground': 'text-on-accent',

  'toggle-track-off': 'surface-sunken',
  'toggle-track-on': 'accent',
  'toggle-knob': 'surface-raised',
  'toggle-border': 'border-strong',

  'tab-foreground': 'text-secondary',
  'tab-foreground-active': 'text-primary',
  'tab-indicator': 'accent',

  'menu-bg': 'surface-raised',
  'menu-border': 'border-default',
  'menu-hover': 'surface-sunken',
  'menu-selected-bg': 'accent-subtle',
  'menu-selected-foreground': 'accent',

  'table-header-bg': 'surface-sunken',
  'table-row-hover': 'surface-sunken',
  'table-row-selected': 'accent-subtle',
  'table-border': 'border-default',

  'avatar-bg': 'accent-subtle',
  'avatar-foreground': 'accent',

  'icon-button-foreground': 'text-secondary',
  'icon-button-bg-hover': 'surface-sunken',
} as const satisfies Record<string, ComponentRef>;

export type ComponentToken = keyof typeof componentTokens;
