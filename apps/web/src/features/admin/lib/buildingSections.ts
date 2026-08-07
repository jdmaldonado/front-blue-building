import { Cpu, CreditCard, DoorOpen, Home, Settings, ShieldAlert, Users, type LucideIcon } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';

export type BuildingSection = {
  to: AppRoute;
  label: string;
  icon: LucideIcon;
};

// The sections of a building, in the order the sidebar shows them. The
// breadcrumb reads the same list, so a section can never be named twice.
export const BUILDING_SECTIONS: readonly BuildingSection[] = [
  { to: AppRoute.AdminBuildingLive, label: 'Puertas y cámaras', icon: DoorOpen },
  { to: AppRoute.AdminBuildingApartments, label: 'Apartamentos', icon: Home },
  { to: AppRoute.AdminBuildingUsers, label: 'Usuarios', icon: Users },
  { to: AppRoute.AdminBuildingReaders, label: 'Lectoras', icon: Cpu },
  { to: AppRoute.AdminBuildingEvents, label: 'Monitoreo', icon: ShieldAlert },
  { to: AppRoute.AdminBuildingSettings, label: 'Ajustes', icon: Settings },
];

export const BUILDING_CARDS_SECTION = { to: AppRoute.AdminCards, label: 'Tarjetas', icon: CreditCard };

// Turns `/admin/buildings/$buildingId/apartments` into a real path.
export function buildingSectionPath(section: AppRoute, buildingId: string): string {
  return section.replace('$buildingId', buildingId);
}
