import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { DiagonalMark } from '../diagonal-mark';
import {
  inputFrameVariants,
  inputMarkVariants,
  inputSlantVariants,
  inputVariants,
  type InputVariants,
} from './Input-variants';

export const inputMarkSides = ['left', 'right'] as const;
export type InputMarkSide = (typeof inputMarkSides)[number];

// Presentational input. Forwards ref and spreads props so react-hook-form's
// `register` works directly: <Input {...register('cedula')} />.
// `inputSize` instead of `size` because <input> already owns a native `size` attr.
type InputProps = ComponentProps<'input'> &
  InputVariants & {
    // Runs the diagonal mark alongside one edge of the frame, the way the
    // current app does on some of its fields. Only drawn when slanted.
    mark?: InputMarkSide;
    ref?: Ref<HTMLInputElement>;
  };

export function Input({ appearance, inputSize, mark, className, ...props }: InputProps) {
  const field = <input className={cn(inputVariants({ appearance, inputSize }), className)} {...props} />;

  if (appearance !== 'slanted') {
    return field;
  }

  // The input comes first so the frame can read its focus and error state as a
  // `peer`, and the frame is painted behind it.
  return (
    <span className={inputFrameVariants()}>
      {field}
      <span aria-hidden className={inputSlantVariants()} />
      {mark === undefined ? null : <DiagonalMark size="lg" className={inputMarkVariants({ side: mark })} />}
    </span>
  );
}
