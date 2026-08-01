import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { Spinner } from '../spinner';
import { buttonVariants, type ButtonVariants } from './Button-variants';

type ButtonProps = ComponentProps<'button'> &
  ButtonVariants & {
    loading?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  intent,
  appearance,
  size,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading}
      className={cn(buttonVariants({ intent, appearance, size }), className)}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
