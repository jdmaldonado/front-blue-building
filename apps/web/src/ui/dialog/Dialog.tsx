import { X } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEventHandler,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { IconButton } from '../icon-button';
import {
  dialogBodyVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogSubheaderVariants,
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
  // Under the header, outside the scroll, like a row of tabs.
  subheader?: ReactNode;
  // Under the body, outside the scroll, with no border of its own.
  bodyEnd?: ReactNode;
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
  subheader,
  bodyEnd,
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

  // A dialog rendered inside another one closes only itself. React routes the
  // `close` event through the tree, so without this the parent would take a
  // child's close as its own and both would disappear.
  const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) {
      onClose();
    }
  };

  // On the body and not where it is used: the brand surface turns text white,
  // and a dialog inside it would inherit that on its light card.
  return createPortal(
    <dialog
      ref={ref}
      onClose={handleClose}
      onClick={handleClick}
      onKeyDown={onKeyDown}
      aria-labelledby={titleId}
      className={cn(dialogVariants({ size }), className)}
    >
      {/* `h-full` passes down a height set on the dialog, so the body fills it. */}
      <div className="flex h-full max-h-[85dvh] flex-col">
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

        {subheader === undefined ? null : <div className={dialogSubheaderVariants()}>{subheader}</div>}

        <div className={dialogBodyVariants()}>{children}</div>

        {bodyEnd}

        {footer === undefined ? null : <div className={dialogFooterVariants()}>{footer}</div>}
      </div>
    </dialog>,
    document.body,
  );
}
