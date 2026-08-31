import {
  DEFAULT_FIRMWARE_VERSION,
  FirmwareTarget,
  FlashSize,
  HardwareVersion,
  buildDynamicFirmwareUrl,
  type Door,
  type FirmwareUpdateParams,
  type ReaderState,
} from '@bb/core';
import { useEffect, useState } from 'react';
import { Alert, Button, Dialog, Field, Input, RadioGroup, Text, type RadioOption } from '../../../ui';

type ReaderFirmwareDialogProps = {
  door: Door | null;
  reported: ReaderState | null;
  pending: boolean;
  onClose: () => void;
  onSend: (params: FirmwareUpdateParams) => void;
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

export function ReaderFirmwareDialog({ door, reported, pending, onClose, onSend }: ReaderFirmwareDialogProps) {
  const [target, setTarget] = useState<FirmwareTarget>(FirmwareTarget.Both);
  const [hwVersion, setHwVersion] = useState<HardwareVersion>(HardwareVersion.V6);
  const [flashSize, setFlashSize] = useState<FlashSize>(FlashSize.Flash8MB);
  const [version, setVersion] = useState<string>(DEFAULT_FIRMWARE_VERSION);
  const [url, setUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<boolean>(false);

  useEffect(() => {
    if (door === null) {
      setTarget(FirmwareTarget.Both);
      setHwVersion(HardwareVersion.V6);
      setFlashSize(FlashSize.Flash8MB);
      setVersion(DEFAULT_FIRMWARE_VERSION);
      setCustomUrl(false);
      return;
    }

    const reportedHw = reported?.readers?.master?.hw_version ?? reported?.readers?.slave?.hw_version;
    if (reportedHw === HardwareVersion.V6 || reportedHw === HardwareVersion.V5) {
      setHwVersion(reportedHw);
    }

    const rawFlash = reported?.system?.flash_size?.trim();
    if (rawFlash) {
      const match = flashOptions.find((opt) => opt.value.toLowerCase() === rawFlash.toLowerCase());
      if (match) {
        setFlashSize(match.value);
      }
    }
  }, [door, reported]);

  useEffect(() => {
    if (!customUrl) {
      setUrl(buildDynamicFirmwareUrl({ hwVersion, flashSize, version }));
    }
  }, [hwVersion, flashSize, version, customUrl]);

  const handleUrlChange = (value: string): void => {
    setUrl(value);
    setCustomUrl(true);
  };

  const handleResetUrl = (): void => {
    setCustomUrl(false);
    setUrl(buildDynamicFirmwareUrl({ hwVersion, flashSize, version }));
  };

  const handleSend = (): void => {
    if (url.trim() === '') {
      return;
    }
    onSend({
      url: url.trim(),
      target,
      hw_version: hwVersion,
      flash_size: flashSize,
    });
  };

  const isValid = url.trim().length > 0;

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
          <Button intent="primary" onClick={handleSend} disabled={!isValid || pending}>
            {pending ? 'Enviando orden...' : 'Actualizar firmware'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5 py-2">
        <Alert variant="warning" title="Proceso crítico de hardware">
          La lectora reiniciará su microcontrolador tras completar la descarga. No cortes la energía durante el proceso.
        </Alert>

        <Field
          htmlFor="target-selection"
          label="Placa destino"
          hint="Selecciona cuál de las dos tarjetas conectadas por SPI recibirá la actualización."
        >
          <RadioGroup
            label="Placa destino"
            value={target}
            options={targetOptions}
            onChange={(val) => setTarget(val)}
            disabled={pending}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            htmlFor="hw-version-selection"
            label="Versión de hardware"
            hint="Revisión electrónica de la placa (autocompletada por telemetría si está disponible)."
          >
            <RadioGroup
              label="Versión de hardware"
              value={hwVersion}
              options={hwOptions}
              onChange={(val) => setHwVersion(val)}
              disabled={pending}
            />
          </Field>

          <Field
            htmlFor="flash-size-selection"
            label="Memoria Flash"
            hint="Capacidad de la memoria física del chip (autocompletada por telemetría si está disponible)."
          >
            <RadioGroup
              label="Memoria Flash"
              value={flashSize}
              options={flashOptions}
              onChange={(val) => setFlashSize(val)}
              disabled={pending}
            />
          </Field>
        </div>

        <Field
          htmlFor="firmware-version-input"
          label="Versión de software"
          hint="Usa 'latest' para compilar la última estable, o un tag semántico (ej. v1.4.6)."
        >
          <Input
            id="firmware-version-input"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="latest"
            disabled={pending}
          />
        </Field>

        <Field
          htmlFor="firmware-url-input"
          label="URL del binario (.bin)"
          hint="Ruta generada automáticamente a partir de los selectores. Puedes editarla si usas un servidor manual."
        >
          <div className="flex flex-col gap-1.5">
            <Input
              id="firmware-url-input"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="http://localhost:8000/..."
              disabled={pending}
              className="font-mono text-(--accent)"
            />
            {customUrl && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResetUrl}
                  className="text-label text-(--muted) hover:text-(--foreground) underline cursor-pointer"
                >
                  Restaurar URL automática
                </button>
              </div>
            )}
          </div>
        </Field>

        <div className="rounded-lg border border-(--border) bg-(--surface-sunken) p-3">
          <Text as="p" size="label" tone="muted">
            Resumen: Se actualizará <strong className="text-(--foreground)">{target}</strong> con binario para{' '}
            <strong className="text-(--foreground)">{hwVersion}</strong> ({flashSize}) versión{' '}
            <strong className="text-(--foreground)">{version}</strong>.
          </Text>
        </div>
      </div>
    </Dialog>
  );
}
