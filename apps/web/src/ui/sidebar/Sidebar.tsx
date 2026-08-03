import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../cn';
import {
  sidebarFooterVariants,
  sidebarHeaderVariants,
  sidebarNavVariants,
  sidebarVariants,
  type SidebarVariants,
} from './Sidebar-variants';

type SidebarProps = Omit<ComponentProps<'aside'>, 'children'> &
  SidebarVariants & {
    header?: ReactNode;
    footer?: ReactNode;
    // Navigation links. They are built by the caller so the router stays typed.
    children: ReactNode;
    navLabel: string;
  };

export function Sidebar({ collapsed, header, footer, children, navLabel, className, ...props }: SidebarProps) {
  return (
    <aside className={cn(sidebarVariants({ collapsed }), className)} {...props}>
      {header === undefined ? null : <div className={sidebarHeaderVariants({ collapsed })}>{header}</div>}

      <nav aria-label={navLabel} className={sidebarNavVariants({ collapsed })}>
        {children}
      </nav>

      {footer === undefined ? null : <div className={sidebarFooterVariants()}>{footer}</div>}
    </aside>
  );
}
