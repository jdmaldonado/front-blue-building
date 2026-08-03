import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { drawerVariants, type DrawerVariants } from './Drawer-variants';

type DrawerProps = DrawerVariants & {
  open: boolean;
  onClose: () => void;
  // The panel has no visible title, so assistive tech needs this name.
  label: string;
  children: ReactNode;
  className?: string;
};

// Panel that slides in from the edge of the screen. Used for navigation on
// small screens, where a fixed sidebar does not fit.
export function Drawer({ open, onClose, label, side, children, className }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const drawer = ref.current;
    if (drawer === null) {
      return;
    }
    if (open && !drawer.open) {
      drawer.showModal();
    }
    if (!open && drawer.open) {
      drawer.close();
    }
  }, [open]);

  // Clicking the backdrop targets the dialog element itself, not its content.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={handleClick}
      aria-label={label}
      className={cn(drawerVariants({ side }), className)}
    >
      {children}
    </dialog>
  );
}
