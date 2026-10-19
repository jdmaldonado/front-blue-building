import { Link, type LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { Badge, sidebarItemVariants, sidebarLabelVariants } from '../../ui';

type AppNavigationItemProps = {
  // Built by the caller so the router keeps checking the destination.
  link: LinkProps;
  icon: LucideIcon;
  label: string;
  // How many things are waiting behind this link. Hidden when there are none.
  badge?: number;
  // Overrides the router's own check, for a link that is the prefix of others.
  selected?: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

export function AppNavigationItem({
  link,
  icon: Icon,
  label,
  badge,
  selected,
  collapsed,
  onNavigate,
}: AppNavigationItemProps) {
  return (
    <Link
      {...link}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      activeProps={{ className: sidebarItemVariants({ collapsed, selected: selected ?? true }) }}
      inactiveProps={{ className: sidebarItemVariants({ collapsed, selected: selected ?? false }) }}
    >
      <Icon size={18} className="shrink-0" aria-hidden />
      {collapsed ? (
        <span className="sr-only">
          {label}
          {badge === undefined ? '' : ` (${badge})`}
        </span>
      ) : (
        <>
          <span className={sidebarLabelVariants()}>{label}</span>
          {badge === undefined ? null : (
            <Badge tone="accent" className="ml-auto">
              {badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
}
