import { DEFAULT_FIRMWARE_VERSION, FirmwareTarget, FlashSize, HardwareVersion, type Door } from '@bb/core';
import { useState } from 'react';
import { Button, Dialog, Field, Input, RadioGroup, type RadioOption } from '../../../ui';

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
  const [target, setTarget] = useState<FirmwareTarget>(FirmwareTarget.Both);
  const [hwVersion, setHwVersion] = useState<HardwareVersion>(HardwareVersion.V6);
  const [flashSize, setFlashSize] = useState<FlashSize>(FlashSize.Flash8MB);
  const [version, setVersion] = useState<string>(DEFAULT_FIRMWARE_VERSION);
  const [url, setUrl] = useState<string>('');

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
        <Field htmlFor="target-selection" label="Placa destino">
          <RadioGroup
            label="Placa destino"
            value={target}
            options={targetOptions}
            onChange={(val) => setTarget(val)}
            disabled={pending}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field htmlFor="hw-version-selection" label="Versión de hardware">
            <RadioGroup
              label="Versión de hardware"
              value={hwVersion}
              options={hwOptions}
              onChange={(val) => setHwVersion(val)}
              disabled={pending}
            />
          </Field>

          <Field htmlFor="flash-size-selection" label="Memoria Flash">
            <RadioGroup
              label="Memoria Flash"
              value={flashSize}
              options={flashOptions}
              onChange={(val) => setFlashSize(val)}
              disabled={pending}
            />
          </Field>
        </div>

        <Field htmlFor="firmware-version-input" label="Versión de software">
          <Input
            id="firmware-version-input"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="latest"
            disabled={pending}
          />
        </Field>

        <Field htmlFor="firmware-url-input" label="URL del binario (.bin)">
          <Input
            id="firmware-url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:8000/..."
            disabled={pending}
          />
        </Field>
      </div>
    </Dialog>
  );
}
