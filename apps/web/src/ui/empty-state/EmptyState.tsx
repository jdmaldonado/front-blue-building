import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../cn';
import {
  emptyStateIconVariants,
  emptyStateTextVariants,
  emptyStateTitleVariants,
  emptyStateVariants,
  type EmptyStateVariants,
} from './EmptyState-variants';

type EmptyStateProps = EmptyStateVariants & {
  icon?: LucideIcon;
  title: string;
  description?: string;
  // Where the person can go from here. Usually a Button.
  action?: ReactNode;
  className?: string;
};

// "There is nothing here" is a result, not an error. It says what is missing and
// what to do next.
export function EmptyState({ icon: Icon, title, description, action, padding, className }: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ padding }), className)}>
      {Icon ? (
        <span className={emptyStateIconVariants({ padding })}>
          <Icon size={padding === 'sm' ? 18 : 22} aria-hidden />
        </span>
      ) : null}
      <span className={emptyStateTitleVariants()}>{title}</span>
      {description ? <span className={emptyStateTextVariants()}>{description}</span> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
