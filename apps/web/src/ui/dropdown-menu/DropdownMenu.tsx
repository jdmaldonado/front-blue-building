import type { LucideIcon } from 'lucide-react';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import {
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuSeparatorVariants,
  dropdownMenuVariants,
  type DropdownMenuAlign,
} from './DropdownMenu-variants';

const MENU_GAP_PX = 6;

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  onSelect: () => void;
}

export interface DropdownMenuGroup {
  id: string;
  label?: string;
  items: ReadonlyArray<DropdownMenuItem>;
}

type DropdownMenuProps = {
  // Which edge of the trigger the menu lines up with.
  align?: DropdownMenuAlign;
  // The control that opens the menu. It receives no props: the menu wraps it.
  trigger: ReactNode;
  groups: ReadonlyArray<DropdownMenuGroup>;
  className?: string;
};

export function DropdownMenu({ trigger, groups, align = 'end', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Below the trigger, or above it when there is no room left under it. Placed
  // again when the page moves, so it follows its button.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const anchor = containerRef.current;
    if (!open || menu === null || anchor === null) {
      return;
    }

    function place(): void {
      if (menu === null || anchor === null) {
        return;
      }
      const box = anchor.getBoundingClientRect();
      const fitsBelow = box.bottom + MENU_GAP_PX + menu.offsetHeight <= window.innerHeight;
      setPosition({
        ...(fitsBelow ? { top: box.bottom + MENU_GAP_PX } : { bottom: window.innerHeight - box.top + MENU_GAP_PX }),
        ...(align === 'start' ? { left: box.left } : { right: window.innerWidth - box.right }),
      });
    }

    menu.showPopover();
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      const target = event.target;
      if (target instanceof Node && containerRef.current?.contains(target) === false) {
        setOpen(false);
      }
    }

    function handleKeyUp(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [open]);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) {
      return;
    }

    event.preventDefault();
    const buttons = Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const enabled = buttons.filter((button) => !button.disabled);
    const current = enabled.findIndex((button) => button === document.activeElement);
    const next = enabled[(current + step + enabled.length) % enabled.length];
    next?.focus();
  }

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <span
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        className="contents"
      >
        {trigger}
      </span>

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          popover="manual"
          onKeyDown={handleMenuKeyDown}
          style={position}
          className={dropdownMenuVariants()}
        >
          {groups.map((group, index) => (
            <div key={group.id} role="group" aria-label={group.label}>
              {index === 0 ? null : <div className={dropdownMenuSeparatorVariants()} />}
              {group.label === undefined ? null : <div className={dropdownMenuLabelVariants()}>{group.label}</div>}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      setOpen(false);
                      item.onSelect();
                    }}
                    className={dropdownMenuItemVariants({ tone: item.tone })}
                  >
                    {Icon ? <Icon size={16} aria-hidden className="shrink-0" /> : null}
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
