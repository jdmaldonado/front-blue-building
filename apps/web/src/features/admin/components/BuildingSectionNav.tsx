import { LayoutDashboard } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { AppNavigationItem } from '../../../layouts/app';
import { BUILDING_CARDS_SECTION, BUILDING_SECTIONS } from '../lib';

type BuildingSectionNavProps = {
  buildingId: string;
  collapsed: boolean;
  onNavigate?: () => void;
};

// Sections of the building the staff is inside. They live in the sidebar and
// not over the content: the floor plan needs all the height it can get.
export function BuildingSectionNav({ buildingId, collapsed, onNavigate }: BuildingSectionNavProps) {
  return (
    <>
      <AppNavigationItem
        link={{ to: AppRoute.AdminBuilding, params: { buildingId }, activeOptions: { exact: true } }}
        icon={LayoutDashboard}
        label="Resumen"
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {BUILDING_SECTIONS.map((section) => (
        <AppNavigationItem
          key={section.to}
          link={{ to: section.to, params: { buildingId } }}
          icon={section.icon}
          label={section.label}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}

      {/* Cards are not a section of the building, but the register mode runs on
          one of its readers, so it starts here with the building already set. */}
      <AppNavigationItem
        link={{ to: BUILDING_CARDS_SECTION.to, search: { buildingId } }}
        icon={BUILDING_CARDS_SECTION.icon}
        label={BUILDING_CARDS_SECTION.label}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
    </>
  );
}
