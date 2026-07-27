import type { SemanticToken } from '../semantic';

// Layer 3: component-level tokens. Each one points at a semantic token (never a
// primitive), so the CSS output becomes `--button-primary-bg: var(--action-primary)`.
export const componentTokens = {
  'button-primary-bg': 'action-primary',
  'button-primary-bg-hover': 'action-primary-hover',
  'button-primary-text': 'surface-base',
} as const satisfies Record<string, SemanticToken>;

export type ComponentToken = keyof typeof componentTokens;
