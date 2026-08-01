import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Standard cn: clsx builds the list, tailwind-merge resolves conflicts so a
// caller's `className` deterministically overrides a primitive's own classes.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
