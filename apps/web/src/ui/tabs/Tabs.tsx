import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { tabsFade, tabsIndicatorVariants, tabsItemVariants, tabsVariants, type TabsVariants } from './Tabs-variants';

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
  const [reach, setReach] = useState<{ start: boolean; end: boolean }>({
    start: false,
    end: false,
  });

  // A scrollable strip looks exactly like a full one until you try it. Measure
  // what is left on each side and fade only that side.
  useEffect(() => {
    const list = listRef.current;
    if (list === null) {
      return;
    }

    const update = () => {
      const remaining = list.scrollWidth - list.clientWidth - list.scrollLeft;
      const next = { start: list.scrollLeft > 1, end: remaining > 1 };
      // Compare the values, not the object. A fresh object every scroll frame
      // and every resize notification would re-render even when nothing moved.
      setReach((current) => (current.start === next.start && current.end === next.end ? current : next));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener('scroll', update);
    };
  }, [items]);

  const fade = reach.start && reach.end ? 'both' : reach.start ? 'start' : reach.end ? 'end' : 'none';

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
      className={cn(tabsVariants({ appearance }), tabsFade[fade], className)}
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
