import { componentTokens } from './components';
import { radius } from './primitives';
import { semanticDark, semanticLight } from './semantic';

const REM_BASE = 16;

// Theme-agnostic primitive dimensions the component layer can alias. The pill
// radius stays in px; scaling it with the root font-size serves no purpose.
function radiusVars(indent: string): string {
  return Object.entries(radius)
    .map(([name, value]) => {
      const css = name === 'round' ? `${value}px` : `${value / REM_BASE}rem`;
      return `${indent}--radius-${name}: ${css};`;
    })
    .join('\n');
}

function semanticVars(tokens: Record<string, string>, indent: string): string {
  return Object.entries(tokens)
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join('\n');
}

function componentVars(tokens: Record<string, string>, indent: string): string {
  return Object.entries(tokens)
    .map(([name, ref]) => `${indent}--${name}: var(--${ref});`)
    .join('\n');
}

// Emits CSS custom properties for both themes. The web app writes this to a .css
// file so Tailwind and plain CSS can consume the semantic layer.
export function generateThemeCss(): string {
  return [
    ':root {',
    radiusVars('  '),
    semanticVars(semanticLight, '  '),
    componentVars(componentTokens, '  '),
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    '  :root {',
    semanticVars(semanticDark, '    '),
    '  }',
    '}',
    '',
    ":root[data-theme='dark'] {",
    semanticVars(semanticDark, '  '),
    '}',
    '',
    ":root[data-theme='light'] {",
    semanticVars(semanticLight, '  '),
    '}',
    '',
  ].join('\n');
}
