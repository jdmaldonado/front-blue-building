import { ChevronDown } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { inputFrameVariants, inputSlantVariants } from '../input';
import { selectVariants, type SelectVariants } from './Select-variants';

export interface SelectOption<TValue extends string> {
  value: TValue;
  label: string;
}

type SelectProps<TValue extends string> = Omit<ComponentProps<'select'>, 'size' | 'onChange' | 'value'> &
  SelectVariants & {
    options: ReadonlyArray<SelectOption<TValue>>;
    value: TValue;
    onChange: (value: TValue) => void;
    ref?: Ref<HTMLSelectElement>;
  };

// Native select: it keeps the platform picker on mobile and handles long lists,
// where a RadioGroup would not fit.
export function Select<TValue extends string>({
  options,
  value,
  onChange,
  appearance,
  selectSize,
  className,
  ...props
}: SelectProps<TValue>) {
  const slanted = appearance === 'slanted';

  return (
    <div className={cn(slanted ? inputFrameVariants() : 'relative', className)}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className={selectVariants({ appearance, selectSize })}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {slanted ? <span aria-hidden className={inputSlantVariants()} /> : null}
      <ChevronDown
        size={16}
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 z-10 -translate-y-1/2',
          slanted ? 'right-8 text-(--input-slanted-foreground)' : 'right-3 text-(--text-muted)',
        )}
      />
    </div>
  );
}
