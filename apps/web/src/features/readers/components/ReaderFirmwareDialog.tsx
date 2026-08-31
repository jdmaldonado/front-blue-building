import { FirmwareTarget, FlashSize, HardwareVersion, type Door } from '@bb/core';
import { Button, Dialog, RadioGroup, type RadioOption } from '../../../ui';

type ReaderFirmwareDialogProps = {
  door: Door | null;
  pending: boolean;
  onClose: () => void;
};

const targetOptions: ReadonlyArray<RadioOption<FirmwareTarget>> = [
  { value: FirmwareTarget.Both, label: 'Ambas (Maestra y Esclava)' },
  { value: FirmwareTarget.Master, label: 'Solo Maestra' },
  { value: FirmwareTarget.Slave, label: 'Solo Esclava' },
];

const hwOptions: ReadonlyArray<RadioOption<HardwareVersion>> = [
  { value: HardwareVersion.V6, label: 'Hardware V6 (6.0)' },
  { value: HardwareVersion.V5, label: 'Hardware V5 (5.1)' },
];

const flashOptions: ReadonlyArray<RadioOption<FlashSize>> = [
  { value: FlashSize.Flash4MB, label: '4 MB' },
  { value: FlashSize.Flash8MB, label: '8 MB (Estándar)' },
  { value: FlashSize.Flash16MB, label: '16 MB' },
];

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
      <div className="flex flex-col gap-5 py-2">
        <RadioGroup
          label="Placa destino"
          value={FirmwareTarget.Both}
          options={targetOptions}
          onChange={() => {}}
          disabled={pending}
        />

        <RadioGroup
          label="Versión de hardware"
          value={HardwareVersion.V6}
          options={hwOptions}
          onChange={() => {}}
          disabled={pending}
        />

        <RadioGroup
          label="Memoria Flash"
          value={FlashSize.Flash8MB}
          options={flashOptions}
          onChange={() => {}}
          disabled={pending}
        />
      </div>
    </Dialog>
  );
}
