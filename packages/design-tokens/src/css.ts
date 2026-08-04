import { componentTokens } from './components';
import { animation, duration, easing, fontFamily, keyframes, pattern, radius, typeScale } from './primitives';
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

// Durations are plain vars: Tailwind v4 has no `--duration-*` namespace, so they
// are consumed as `duration-(--duration-fast)`.
function durationVars(indent: string): string {
  return Object.entries(duration)
    .map(([name, value]) => `${indent}--duration-${name}: ${value}ms;`)
    .join('\n');
}

function keyframeBlocks(): string {
  return Object.entries(keyframes)
    .map(([name, steps]) => {
      const body = Object.entries(steps)
        .map(([stop, declarations]) => `  ${stop} { ${declarations} }`)
        .join('\n');
      return `@keyframes ${name} {\n${body}\n}`;
    })
    .join('\n\n');
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

// Font families and the type scale go inside `@theme` so Tailwind derives its
// utilities from them: `font-display`, `text-title`, `text-body`... Patterns are
// plain vars, consumed as `bg-[image:var(--pattern-honeycomb)]`.
//
// `--text-*: initial` wipes Tailwind's default scale on purpose: after this,
// `text-sm` or `text-2xl` do not exist and the only sizes available are ours.
function themeBlock(): string {
  const families = Object.entries(fontFamily).map(([name, value]) => `  --font-${name}: ${value};`);

  const type = Object.entries(typeScale).flatMap(([name, { size, lineHeight }]) => [
    `  --text-${name}: ${size / REM_BASE}rem;`,
    `  --text-${name}--line-height: ${lineHeight};`,
  ]);

  const patterns = Object.entries(pattern).map(([name, value]) => `  --pattern-${name}: ${value};`);

  // `--ease-*` and `--animate-*` are Tailwind v4 namespaces: they become the
  // `ease-standard` and `animate-scan` utilities.
  const eases = Object.entries(easing).map(([name, value]) => `  --ease-${name}: ${value};`);
  const animations = Object.entries(animation).map(([name, { value }]) => `  --animate-${name}: ${value};`);

  return [
    '@theme {',
    '  --text-*: initial;',
    ...type,
    '',
    ...families,
    ...patterns,
    '',
    ...eases,
    ...animations,
    '}',
  ].join('\n');
}

// Emits CSS custom properties for both themes. The web app writes this to a .css
// file so Tailwind and plain CSS can consume the semantic layer.
export function generateThemeCss(): string {
  return [
    themeBlock(),
    '',
    keyframeBlocks(),
    '',
    ':root {',
    radiusVars('  '),
    durationVars('  '),
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
