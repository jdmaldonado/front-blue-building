import { UserEvent, isBuildingInMaintenance, type Building } from '@bb/core';
import { useBuildingMaintenance } from '@bb/logic';
import { useCallback, useState } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { useUserEventActions } from '../../building-events';

export interface BuildingActionsController {
  inMaintenance: boolean;
  maintenanceOpen: boolean;
  maintenancePending: boolean;
  openMaintenance: () => void;
  closeMaintenance: () => void;
  startMaintenance: (durationMinutes: number) => void;
  cancelMaintenance: () => void;
  mute: () => void;
  restartRpi: () => void;
}

// Every staff action over one building, in one place. The menu, the summary and
// the table all drive the same controller.
export function useBuildingActions(building: Building): BuildingActionsController {
  const confirm = useConfirm();
  const toast = useToast();
  const events = useUserEventActions(building.id);
  const maintenance = useBuildingMaintenance();
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  const startMaintenance = useCallback(
    (durationMinutes: number) => {
      maintenance.enable.mutate(
        { buildingId: building.id, durationMinutes },
        {
          onSuccess: () => {
            setMaintenanceOpen(false);
            toast({ tone: 'success', title: 'Mantenimiento activado', message: `${building.name} no enviará avisos.` });
          },
          onError: () => {
            toast({ tone: 'error', title: 'No pudimos activar el mantenimiento', message: 'Intenta de nuevo.' });
          },
        },
      );
    },
    [building.id, building.name, maintenance.enable, toast],
  );

  const cancelMaintenance = useCallback(() => {
    void (async () => {
      const confirmed = await confirm({
        title: '¿Cancelar el mantenimiento?',
        description: `${building.name} vuelve a enviar mensajes y llamadas.`,
        confirmLabel: 'Cancelar mantenimiento',
      });
      if (!confirmed) {
        return;
      }

      maintenance.disable.mutate(building.id, {
        onSuccess: () => {
          toast({ tone: 'success', title: 'Mantenimiento cancelado' });
        },
        onError: () => {
          toast({ tone: 'error', title: 'No pudimos cancelar el mantenimiento', message: 'Intenta de nuevo.' });
        },
      });
    })();
  }, [building.id, building.name, confirm, maintenance.disable, toast]);

  return {
    inMaintenance: isBuildingInMaintenance(building),
    maintenanceOpen,
    maintenancePending: maintenance.enable.isPending,
    openMaintenance: () => setMaintenanceOpen(true),
    closeMaintenance: () => setMaintenanceOpen(false),
    startMaintenance,
    cancelMaintenance,
    mute: () => void events.request(UserEvent.Mute),
    restartRpi: () => void events.request(UserEvent.RestartRpi),
  };
}
