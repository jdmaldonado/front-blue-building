import { useState } from 'react';
import { Alert, Button, Dialog, RadioGroup } from '../../../ui';
import { DEFAULT_MAINTENANCE_DURATION, MAINTENANCE_OPTIONS, type MaintenanceDuration } from '../lib';

type MaintenanceDialogProps = {
  open: boolean;
  buildingName: string;
  pending: boolean;
  onClose: () => void;
  onConfirm: (durationMinutes: number) => void;
};

export function MaintenanceDialog({ open, buildingName, pending, onClose, onConfirm }: MaintenanceDialogProps) {
  const [duration, setDuration] = useState<MaintenanceDuration>(DEFAULT_MAINTENANCE_DURATION);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title="Activar mantenimiento"
      description={buildingName}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={pending} onClick={() => onConfirm(Number(duration))}>
            Activar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Alert variant="info" title="No apaga nada del edificio">
          Solo deja de enviar mensajes y llamadas mientras dura. Las puertas y las alarmas siguen igual.
        </Alert>

        <RadioGroup
          options={MAINTENANCE_OPTIONS}
          value={duration}
          onChange={setDuration}
          label="Duración del mantenimiento"
        />
      </div>
    </Dialog>
  );
}
