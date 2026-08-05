import { X } from 'lucide-react';
import { useEffect, useId, useRef, type KeyboardEventHandler, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { IconButton } from '../icon-button';
import {
  dialogBodyVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogVariants,
  type DialogSize,
} from './Dialog-variants';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  size?: DialogSize;
  // Rendered next to the title, before the close button. It stays visible while
  // the body scrolls.
  headerAside?: ReactNode;
  footer?: ReactNode;
  // Keys pressed anywhere inside the dialog bubble up to here.
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  size,
  headerAside,
  footer,
  onKeyDown,
  children,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog === null) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
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
      onKeyDown={onKeyDown}
      aria-labelledby={titleId}
      className={cn(dialogVariants({ size }), className)}
    >
      <div className="flex max-h-[85dvh] flex-col">
        <div className={dialogHeaderVariants()}>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 id={titleId} className="font-display text-title-sm font-bold tracking-tight">
              {title}
            </h2>
            {description === undefined ? null : (
              <div className="text-body-sm text-(--text-secondary)">{description}</div>
            )}
          </div>
          {headerAside}
          <IconButton label="Cerrar" onClick={onClose} className="ml-auto">
            <X size={18} />
          </IconButton>
        </div>

        <div className={dialogBodyVariants()}>{children}</div>

        {footer === undefined ? null : <div className={dialogFooterVariants()}>{footer}</div>}
      </div>
    </dialog>
  );
}
