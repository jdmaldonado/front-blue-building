import { isBuildingInMaintenance } from '@bb/core';
import { BellOff, Power, Wrench } from 'lucide-react';
import { useBuilding } from '../../app/BuildingContext';
import { Alert, Button, Card, Text } from '../../ui';
import { MaintenanceDialog } from './components';
import { useBuildingActions } from './hooks';
import { maintenanceRemaining } from './lib';

// The same three actions as the menu, with room to say what each one does.
export function BuildingSettingsPage() {
  const building = useBuilding();
  const actions = useBuildingActions(building);
  const endsAt = building.maintenanceModeEndsAt;
  const inMaintenance = isBuildingInMaintenance(building);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Wrench size={18} aria-hidden className="text-(--text-secondary)" />
          <Text as="h2" size="title-sm" weight="medium">
            Mantenimiento
          </Text>
        </div>

        <Text size="body-sm" tone="secondary">
          Deja de enviar mensajes y llamadas del edificio durante un tiempo. Las puertas, las alarmas y las cámaras
          siguen funcionando igual. Sirve cuando hay obras que dispararían muchos eventos.
        </Text>

        {inMaintenance && endsAt !== null && endsAt !== undefined ? (
          <>
            <Alert variant="warning" title="Mantenimiento activo">
              Termina en {maintenanceRemaining(endsAt)}. Si nadie lo cancela, los avisos vuelven solos al vencer.
            </Alert>
            <Button intent="neutral" appearance="outline" onClick={actions.cancelMaintenance} className="self-start">
              Cancelar mantenimiento
            </Button>
          </>
        ) : (
          <Button onClick={actions.openMaintenance} className="self-start">
            Activar mantenimiento
          </Button>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BellOff size={18} aria-hidden className="text-(--text-secondary)" />
          <Text as="h2" size="title-sm" weight="medium">
            Silenciar alarma
          </Text>
        </div>

        <Text size="body-sm" tone="secondary">
          Apaga el sonido de la alarma en todo el edificio. Úsalo solo cuando ya revisaste que no pasa nada.
        </Text>

        <Button intent="success" onClick={actions.mute} className="self-start">
          Silenciar alarma
        </Button>
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Power size={18} aria-hidden className="text-(--text-secondary)" />
          <Text as="h2" size="title-sm" weight="medium">
            Reiniciar equipo
          </Text>
        </div>

        <Text size="body-sm" tone="secondary">
          Reinicia la Raspberry Pi del edificio. Mientras arranca, el edificio queda sin conexión con el servidor.
        </Text>

        <Alert variant="warning" title="No sabemos si llegó">
          El servidor confirma que envió la orden, no que el equipo la haya recibido ni ejecutado.
        </Alert>

        <Button intent="destructive" onClick={actions.restartRpi} className="self-start">
          Reiniciar equipo
        </Button>
      </Card>

      <MaintenanceDialog
        open={actions.maintenanceOpen}
        buildingName={building.name}
        pending={actions.maintenancePending}
        onClose={actions.closeMaintenance}
        onConfirm={actions.startMaintenance}
      />
    </div>
  );
}
