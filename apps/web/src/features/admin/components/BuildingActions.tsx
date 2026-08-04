import type { Building } from '@bb/core';
import { BellOff, MoreVertical, Power, Wrench } from 'lucide-react';
import { DropdownMenu, IconButton, type DropdownMenuGroup } from '../../../ui';
import { useBuildingActions } from '../hooks';
import { MaintenanceDialog } from './MaintenanceDialog';

type BuildingActionsProps = {
  building: Building;
  align?: 'start' | 'end';
};

// The same menu wherever a building shows up: the panorama table, the building
// header, a search result. Staff learns it once.
export function BuildingActions({ building, align }: BuildingActionsProps) {
  const actions = useBuildingActions(building);

  const groups: DropdownMenuGroup[] = [
    {
      id: 'alarm',
      items: [{ id: 'mute', label: 'Silenciar alarma', icon: BellOff, onSelect: actions.mute }],
    },
    {
      id: 'maintenance',
      items: [
        actions.inMaintenance
          ? {
              id: 'maintenance-off',
              label: 'Cancelar mantenimiento',
              icon: Wrench,
              onSelect: actions.cancelMaintenance,
            }
          : {
              id: 'maintenance-on',
              label: 'Activar mantenimiento',
              icon: Wrench,
              onSelect: actions.openMaintenance,
            },
      ],
    },
    {
      id: 'device',
      items: [{ id: 'restart', label: 'Reiniciar equipo', icon: Power, tone: 'danger', onSelect: actions.restartRpi }],
    },
  ];

  return (
    <>
      <DropdownMenu
        align={align}
        groups={groups}
        trigger={
          <IconButton label={`Acciones de ${building.name}`}>
            <MoreVertical size={18} />
          </IconButton>
        }
      />

      <MaintenanceDialog
        open={actions.maintenanceOpen}
        buildingName={building.name}
        pending={actions.maintenancePending}
        onClose={actions.closeMaintenance}
        onConfirm={actions.startMaintenance}
      />
    </>
  );
}
