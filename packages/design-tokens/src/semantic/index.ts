import { palette } from '../primitives';

// Layer 2: intent. This is the only color layer components should consume.
export const semanticLight = {
  'surface-base': palette.gray[0],
  'surface-raised': palette.gray[50],
  'text-primary': palette.gray[900],
  'text-muted': palette.gray[500],
  'border-default': palette.gray[200],
  'action-primary': palette.blue[600],
  'action-primary-hover': palette.blue[700],
  'status-danger': palette.red[600],
  'status-success': palette.green[600],
  'status-door-open': palette.green[500],
  'status-door-closed': palette.gray[500],
} as const;

export const semanticDark = {
  'surface-base': palette.gray[950],
  'surface-raised': palette.gray[900],
  'text-primary': palette.gray[50],
  'text-muted': palette.gray[500],
  'border-default': palette.gray[700],
  'action-primary': palette.blue[500],
  'action-primary-hover': palette.blue[600],
  'status-danger': palette.red[500],
  'status-success': palette.green[500],
  'status-door-open': palette.green[500],
  'status-door-closed': palette.gray[500],
} as const;

export type SemanticToken = keyof typeof semanticLight;
