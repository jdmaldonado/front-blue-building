import { Button, type ButtonIntent } from '../button';
import { Dialog } from '../dialog';
import { confirmDialogFooterVariants, confirmDialogTextVariants } from './ConfirmDialog-variants';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  intent?: ButtonIntent;
  onConfirm: () => void;
  onCancel: () => void;
};

// Asks before doing something the user cannot undo. It holds no state: the
// caller decides when it is open and what each answer means.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  intent,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={
        <div className={confirmDialogFooterVariants()}>
          <Button intent="neutral" appearance="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button intent={intent} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      {description === undefined ? null : <p className={confirmDialogTextVariants()}>{description}</p>}
    </Dialog>
  );
}
