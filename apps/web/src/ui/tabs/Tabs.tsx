import type { LucideIcon } from 'lucide-react';
import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { tabsIndicatorVariants, tabsItemVariants, tabsVariants, type TabsVariants } from './Tabs-variants';

export interface TabItem<TValue extends string> {
  value: TValue;
  label: string;
  icon?: LucideIcon;
  // Small extra on the right of the label, like a count.
  aside?: ReactNode;
  disabled?: boolean;
}

type TabsProps<TValue extends string> = TabsVariants & {
  items: ReadonlyArray<TabItem<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  // Read out to screen readers, for example "Secciones del edificio".
  label: string;
  className?: string;
};

// Only the tab list. Here the panels are usually nested routes.
export function Tabs<TValue extends string>({
  items,
  value,
  onChange,
  label,
  appearance,
  className,
}: TabsProps<TValue>) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) {
      return;
    }

    const enabled = items.filter((item) => item.disabled !== true);
    const current = enabled.findIndex((item) => item.value === value);
    const next = enabled[(current + step + enabled.length) % enabled.length];
    if (next === undefined) {
      return;
    }

    event.preventDefault();
    onChange(next.value);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(tabsVariants({ appearance }), className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        const Icon = item.icon;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-value={item.value}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={tabsItemVariants({ appearance, active })}
          >
            {Icon ? <Icon size={16} aria-hidden /> : null}
            {item.label}
            {item.aside}
            {appearance === 'pill' ? null : <span aria-hidden className={tabsIndicatorVariants({ active })} />}
          </button>
        );
      })}
    </div>
  );
}
