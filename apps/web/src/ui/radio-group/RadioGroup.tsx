import type { LucideIcon } from 'lucide-react';
import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../cn';
import {
  radioGroupDotVariants,
  radioGroupIndicatorVariants,
  radioGroupItemVariants,
  radioGroupVariants,
  type RadioGroupAppearance,
  type RadioGroupSize,
} from './RadioGroup-variants';

export interface RadioOption<TValue extends string> {
  value: TValue;
  label: string;
  icon?: LucideIcon;
}

type RadioGroupProps<TValue extends string> = {
  options: ReadonlyArray<RadioOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  // The group has no visible title, so assistive tech needs this name.
  label: string;
  appearance?: RadioGroupAppearance;
  size?: RadioGroupSize;
  // Leaves only the icon on screen. The label stays for screen readers, so
  // every option keeps a name.
  hideLabels?: boolean;
  disabled?: boolean;
  className?: string;
};

const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp'];
const NEXT_KEYS = ['ArrowRight', 'ArrowDown'];

// Single choice among a few options. One tab stop for the whole group and arrows
// to move between options, as the radiogroup pattern prescribes.
export function RadioGroup<TValue extends string>({
  options,
  value,
  onChange,
  label,
  appearance = 'list',
  size = 'md',
  hideLabels = false,
  disabled = false,
  className,
}: RadioGroupProps<TValue>) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (offset: number) => {
    const current = options.findIndex((option) => option.value === value);
    const next = options[(current + offset + options.length) % options.length];
    if (next === undefined) {
      return;
    }
    onChange(next.value);
    itemRefs.current[options.indexOf(next)]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    if (PREVIOUS_KEYS.includes(event.key)) {
      event.preventDefault();
      move(-1);
    }
    if (NEXT_KEYS.includes(event.key)) {
      event.preventDefault();
      move(1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(radioGroupVariants({ appearance, size }), className)}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={radioGroupItemVariants({ appearance, size, selected })}
          >
            {appearance === 'list' ? (
              <span className={radioGroupIndicatorVariants({ size, selected })} aria-hidden>
                {selected ? <span className={radioGroupDotVariants({ size })} /> : null}
              </span>
            ) : null}
            {Icon ? <Icon size={16} aria-hidden /> : null}
            {hideLabels ? <span className="sr-only">{option.label}</span> : option.label}
          </button>
        );
      })}
    </div>
  );
}
