import { typeScale } from '@bb/design-tokens';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge only knows Tailwind's own sizes, so it took `text-title` for a
// color and dropped it next to `text-(--text-primary)`. Now it knows our scale.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: Object.keys(typeScale) }] } },
});

// Standard cn: clsx builds the list, tailwind-merge resolves conflicts so a
// caller's `className` deterministically overrides a primitive's own classes.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
