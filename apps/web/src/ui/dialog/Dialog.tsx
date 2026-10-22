import { X } from 'lucide-react';
import {
  useLayoutEffect,
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
  // With its description. Screen readers still read both: a dialog needs a name.
  hideTitle?: boolean;
  description?: ReactNode;
  size?: DialogSize;
  // Rendered next to the title, before the close button. It stays visible while
  // the body scrolls.
  headerAside?: ReactNode;
  // Under the header, outside the scroll, like a row of tabs.
  subheader?: ReactNode;
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
  hideTitle = false,
  description,
  size,
  headerAside,
  subheader,
  footer,
  onKeyDown,
  children,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // A layout effect, so the dialog is open before the effects of its content
  // run: a child that scrolls or measures sees it visible.
  useLayoutEffect(() => {
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
          <div className={cn('flex min-w-0 flex-col gap-0.5', hideTitle ? 'sr-only' : '')}>
            <h2 id={titleId} className="font-display text-subtitle font-bold tracking-tight">
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

        {footer === undefined ? null : <div className={dialogFooterVariants()}>{footer}</div>}
      </div>
    </dialog>,
    document.body,
  );
}
