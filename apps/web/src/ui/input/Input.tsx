import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { inputVariants, type InputVariants } from './Input-variants';

// Presentational input. Forwards ref and spreads props so react-hook-form's
// `register` works directly: <Input {...register('cedula')} />.
// `inputSize` instead of `size` because <input> already owns a native `size` attr.
type InputProps = ComponentProps<'input'> & InputVariants & { ref?: Ref<HTMLInputElement> };

export function Input({ inputSize, className, ...props }: InputProps) {
  return <input className={cn(inputVariants({ inputSize }), className)} {...props} />;
}
