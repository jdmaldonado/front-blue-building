import { DoorOpen, Home, LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { AppNavigationItem } from '../../../layouts/app';

type BuildingSectionNavProps = {
  buildingId: string;
  collapsed: boolean;
  onNavigate?: () => void;
};

const sections: Array<{ to: AppRoute; label: string; icon: LucideIcon; exact: boolean }> = [
  { to: AppRoute.AdminBuilding, label: 'Resumen', icon: LayoutDashboard, exact: true },
  { to: AppRoute.AdminBuildingLive, label: 'Puertas y cámaras', icon: DoorOpen, exact: false },
  { to: AppRoute.AdminBuildingApartments, label: 'Apartamentos', icon: Home, exact: false },
  { to: AppRoute.AdminBuildingUsers, label: 'Usuarios', icon: Users, exact: false },
  { to: AppRoute.AdminBuildingSettings, label: 'Ajustes', icon: Settings, exact: false },
];

// Sections of the building the staff is inside. They live in the sidebar and
// not over the content: the floor plan needs all the height it can get.
export function BuildingSectionNav({ buildingId, collapsed, onNavigate }: BuildingSectionNavProps) {
  return (
    <>
      {sections.map((section) => (
        <AppNavigationItem
          key={section.to}
          link={{ to: section.to, params: { buildingId }, activeOptions: { exact: section.exact } }}
          icon={section.icon}
          label={section.label}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}
