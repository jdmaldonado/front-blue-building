import { type Door } from '@bb/core';
import { Dialog, Button } from '../../../ui';

type ReaderFirmwareDialogProps = {
  door: Door | null;
  pending: boolean;
  onClose: () => void;
};

export function ReaderFirmwareDialog({ door, pending, onClose }: ReaderFirmwareDialogProps) {
  return (
    <Dialog
      open={door !== null}
      onClose={onClose}
      size="lg"
      title="Actualizar firmware (OTA)"
      description={door?.name ?? 'Lectora seleccionada'}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>

          <Button intent="primary" onClick={() => {}} disabled={pending}>
            Actualizar firmware
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5 py-2">Configuración de actualización de firmware.</div>
    </Dialog>
  );
}
