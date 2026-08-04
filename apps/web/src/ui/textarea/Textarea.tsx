import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { textareaVariants, type TextareaVariants } from './Textarea-variants';

// `textareaSize` because `size` is already a native attribute, like in Input.
type TextareaProps = ComponentProps<'textarea'> & TextareaVariants & { ref?: Ref<HTMLTextAreaElement> };

export function Textarea({ textareaSize, className, ...props }: TextareaProps) {
  return <textarea className={cn(textareaVariants({ textareaSize }), className)} {...props} />;
}
