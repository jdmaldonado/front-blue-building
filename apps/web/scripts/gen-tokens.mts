import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateThemeCss } from '@bb/design-tokens';

const outPath = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, generateThemeCss());
