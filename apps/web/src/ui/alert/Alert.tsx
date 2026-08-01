import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../cn';
import { alertTextVariants, alertTitleVariants, alertVariants, type AlertVariant } from './Alert-variants';

const icons: Record<AlertVariant, LucideIcon> = {
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  success: CircleCheck,
};

type AlertProps = {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  className?: string;
};

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)}>
      <Icon size={18} className={cn('mt-0.5 shrink-0', alertTitleVariants({ variant }))} />
      <div className="flex flex-col gap-1">
        <span className={alertTitleVariants({ variant })}>{title}</span>
        {children ? <span className={alertTextVariants({ variant })}>{children}</span> : null}
      </div>
    </div>
  );
}
