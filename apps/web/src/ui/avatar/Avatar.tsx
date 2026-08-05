import { User } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { avatarVariants, type AvatarVariants } from './Avatar-variants';

type AvatarProps = ComponentProps<'span'> &
  AvatarVariants & {
    name: string;
    // Photo of the person. Falls back to the initials when missing.
    src?: string | null;
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

export function Avatar({ name, src, size, className, ...props }: AvatarProps) {
  const initials = initialsOf(name);

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(avatarVariants({ size }), 'overflow-hidden', className)}
      {...props}
    >
      {src === undefined || src === null || src === '' ? (
        initials === '' ? (
          <User size={16} aria-hidden />
        ) : (
          initials
        )
      ) : (
        <img src={src} alt="" className="size-full object-cover" />
      )}
    </span>
  );
}
