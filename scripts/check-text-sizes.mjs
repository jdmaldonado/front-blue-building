// Text sizes come from <Text> or textVariants. Only the primitives in ui/ may
// use the scale classes (text-body, text-title...) directly.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'apps/web/src';
const ALLOWED = ['apps/web/src/ui/', 'apps/web/src/styles/'];
// The sizes are read from the generated tokens, so the list never goes stale.
const tokens = readFileSync('apps/web/src/styles/tokens.css', 'utf8');
const SIZES = [...tokens.matchAll(/--text-([a-z-]+): [\d.]+rem;/g)].map((match) => match[1]);
const pattern = new RegExp(`(?<![\\w-])text-(${SIZES.join('|')})(?![\\w-])`, 'g');

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield path;
  }
}

const problems = [];
for (const path of files(ROOT)) {
  if (ALLOWED.some((prefix) => path.startsWith(prefix))) continue;
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      for (const match of line.matchAll(pattern)) {
        problems.push(`${path}:${index + 1}  ${match[0]}: usa <Text size="${match[1]}"> o textVariants`);
      }
    });
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
