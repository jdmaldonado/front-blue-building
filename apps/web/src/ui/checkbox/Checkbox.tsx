import { Check, Minus } from 'lucide-react';
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../cn';
import {
  checkboxDescriptionVariants,
  checkboxLabelVariants,
  checkboxVariants,
  type CheckboxVariants,
} from './Checkbox-variants';

type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'onChange' | 'checked'> &
  CheckboxVariants & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: ReactNode;
    description?: string;
    // Half state, for a header that selects every row: some are checked.
    indeterminate?: boolean;
  };

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  indeterminate = false,
  checkboxSize,
  disabled = false,
  className,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // `indeterminate` only exists as a DOM property, there is no attribute.
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={cn(checkboxLabelVariants({ checkboxSize, disabled }), className)}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
        {...props}
      />
      <span className={checkboxVariants({ checkboxSize })}>
        {indeterminate ? (
          <Minus size={checkboxSize === 'sm' ? 12 : 14} strokeWidth={3} aria-hidden />
        ) : checked ? (
          <Check size={checkboxSize === 'sm' ? 12 : 14} strokeWidth={3} aria-hidden />
        ) : null}
      </span>
      {label === undefined && description === undefined ? null : (
        <span className="flex flex-col gap-0.5">
          {label}
          {description ? <span className={checkboxDescriptionVariants()}>{description}</span> : null}
        </span>
      )}
    </label>
  );
}
