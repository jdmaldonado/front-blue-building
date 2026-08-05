import type { ComponentProps, Ref } from 'react';
import { cn } from '../cn';
import { tooltipVariants, type TooltipSide } from '../tooltip';
import { iconButtonVariants, type IconButtonVariants } from './IconButton-variants';

// Icon-only button. `label` is required because there is no visible text.
type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> &
  IconButtonVariants & {
    label: string;
    // The label also shows on hover. Turn it off where the button already sits
    // next to its own explanation.
    hint?: boolean;
    hintSide?: TooltipSide;
    ref?: Ref<HTMLButtonElement>;
  };

// An icon alone tells nobody what it does. The label was already there for
// screen readers, so on a pointer it shows as a tooltip too: same text, one
// source. Touch never hovers, so nothing changes on a phone.
export function IconButton({
  label,
  size,
  tone,
  hint = true,
  hintSide,
  type = 'button',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      // The bubble lives inside the button instead of in a wrapper: a wrapper
      // would swallow whatever layout class the caller put on the button.
      className={cn(iconButtonVariants({ size, tone }), hint ? 'group relative' : '', className)}
      {...props}
    >
      {children}
      {hint ? (
        // `aria-hidden`: the button is already named by `aria-label`, and a
        // screen reader saying it twice helps nobody.
        <span aria-hidden className={tooltipVariants({ side: hintSide })}>
          {label}
        </span>
      ) : null}
    </button>
  );
}
