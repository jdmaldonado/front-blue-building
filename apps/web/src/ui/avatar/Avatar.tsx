import { User } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { avatarVariants, type AvatarVariants } from './Avatar-variants';

type AvatarProps = ComponentProps<'span'> &
  AvatarVariants & {
    name: string;
  };

const MAX_INITIALS = 2;

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0))
    .join('');
}

export function Avatar({ name, size, className, ...props }: AvatarProps) {
  const initials = initialsOf(name);

  return (
    <span role="img" aria-label={name} className={cn(avatarVariants({ size }), className)} {...props}>
      {initials === '' ? <User size={16} aria-hidden /> : initials}
    </span>
  );
}
