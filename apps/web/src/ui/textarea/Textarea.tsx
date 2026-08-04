import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { textareaVariants, type TextareaVariants } from './Textarea-variants';

// `textareaSize` instead of `size` to stay away from the native attribute, the
// same rule Input follows.
type TextareaProps = ComponentProps<'textarea'> & TextareaVariants & { ref?: Ref<HTMLTextAreaElement> };

export function Textarea({ textareaSize, className, ...props }: TextareaProps) {
  return <textarea className={cn(textareaVariants({ textareaSize }), className)} {...props} />;
}
