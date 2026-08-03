import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { cn } from '../cn';
import { IconButton } from '../icon-button';
import { toastTextVariants, toastTitleVariants, toastVariants, type ToastTone } from './Toast-variants';

const TONE_ICON: Record<ToastTone, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

type ToastProps = {
  tone: ToastTone;
  title: string;
  message?: string;
  onClose: () => void;
  className?: string;
};

export function Toast({ tone, title, message, onClose, className }: ToastProps) {
  const Icon = TONE_ICON[tone];

  return (
    <div className={cn(toastVariants({ tone }), className)}>
      <Icon size={18} className={cn('mt-0.5 shrink-0', toastTitleVariants({ tone }))} aria-hidden />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className={toastTitleVariants({ tone })}>{title}</span>
        {message === undefined ? null : <span className={toastTextVariants({ tone })}>{message}</span>}
      </div>
      <IconButton label="Cerrar aviso" onClick={onClose} className="-my-1 -mr-1 ml-auto">
        <X size={16} />
      </IconButton>
    </div>
  );
}
