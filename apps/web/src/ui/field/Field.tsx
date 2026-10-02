import type { ReactNode } from 'react';
import { cn } from '../cn';
import { fieldLabelVariants, fieldMessageVariants, fieldVariants } from './Field-variants';

// Layout-only wrapper: label + control + error/hint. Holds no form state; the
// caller wires the control (and its aria-describedby) to react-hook-form.
type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  // Keeps the label for screen readers but takes it off the screen, for forms
  // where the placeholder already says what the field is.
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, hint, required, hideLabel = false, className, children }: FieldProps) {
  const invalid = error !== undefined;

  return (
    <div className={cn(fieldVariants(), className)}>
      <label htmlFor={htmlFor} className={cn(fieldLabelVariants({ invalid }), hideLabel ? 'sr-only' : '')}>
        {label}
        {required ? <span className="text-(--destructive)"> *</span> : null}
      </label>
      {children}
      {error ? (
        <span id={`${htmlFor}-error`} className={fieldMessageVariants({ tone: 'error' })}>
          {error}
        </span>
      ) : hint ? (
        <span id={`${htmlFor}-hint`} className={fieldMessageVariants({ tone: 'hint' })}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
