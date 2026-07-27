import { componentTokens } from './components';
import { semanticDark, semanticLight } from './semantic';

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
