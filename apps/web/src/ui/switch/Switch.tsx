import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../cn';
import { switchKnobVariants, switchLabelVariants, switchTrackVariants, type SwitchVariants } from './Switch-variants';

type SwitchProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'onChange' | 'checked'> &
  SwitchVariants & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: ReactNode;
    // Puts the label first and pushes the switch to the end of the row.
    labelPosition?: 'start' | 'end';
  };

// A checkbox with `role="switch"`: it turns something on or off right away, it
// does not wait for a form to be submitted.
export function Switch({
  checked,
  onChange,
  label,
  labelPosition = 'end',
  switchSize,
  disabled = false,
  className,
  ...props
}: SwitchProps) {
  return (
    <label
      className={cn(
        switchLabelVariants({ switchSize, disabled }),
        labelPosition === 'start' ? 'flex-row-reverse justify-between' : '',
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
        {...props}
      />
      <span className={switchTrackVariants({ switchSize })}>
        <span className={switchKnobVariants({ switchSize, checked })} />
      </span>
      {label}
    </label>
  );
}
