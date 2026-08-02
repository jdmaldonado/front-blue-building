import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { iconButtonVariants, type IconButtonVariants } from './IconButton-variants';

// Icon-only button. `label` is required because there is no visible text.
type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> &
  IconButtonVariants & {
    label: string;
    ref?: Ref<HTMLButtonElement>;
  };

export function IconButton({ label, size, tone, type = 'button', className, ...props }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} className={cn(iconButtonVariants({ size, tone }), className)} {...props} />
  );
}
