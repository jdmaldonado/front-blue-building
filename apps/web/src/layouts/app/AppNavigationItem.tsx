import { Link, type LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { sidebarItemVariants, sidebarLabelVariants } from '../../ui';

type AppNavigationItemProps = {
  // Built by the caller so the router keeps checking the destination.
  link: LinkProps;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onNavigate?: () => void;
};

export function AppNavigationItem({ link, icon: Icon, label, collapsed, onNavigate }: AppNavigationItemProps) {
  return (
    <Link
      {...link}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      activeProps={{ className: sidebarItemVariants({ collapsed, selected: true }) }}
      inactiveProps={{ className: sidebarItemVariants({ collapsed, selected: false }) }}
    >
      <Icon size={18} className="shrink-0" aria-hidden />
      {collapsed ? <span className="sr-only">{label}</span> : <span className={sidebarLabelVariants()}>{label}</span>}
    </Link>
  );
}
