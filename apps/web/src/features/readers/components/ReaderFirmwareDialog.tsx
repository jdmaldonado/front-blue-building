import {
  DEFAULT_FIRMWARE_VERSION,
  FirmwareTarget,
  FlashSize,
  HardwareVersion,
  buildDynamicFirmwareUrl,
  parseFlashSize,
  parseHardwareVersion,
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

const BASE_TARGET_OPTIONS: ReadonlyArray<RadioOption<FirmwareTarget>> = [
  { value: FirmwareTarget.Both, label: 'Ambas (Maestra y Esclava)' },
  { value: FirmwareTarget.Master, label: 'Solo Maestra' },
  { value: FirmwareTarget.Slave, label: 'Solo Esclava' },
];

export function ReaderFirmwareDialog({ door, reported, pending, onClose, onSend }: ReaderFirmwareDialogProps) {
  const [target, setTarget] = useState<FirmwareTarget>(FirmwareTarget.Both);
  const [version, setVersion] = useState<string>(DEFAULT_FIRMWARE_VERSION);
  const [url, setUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<boolean>(false);
  const slaveState = reported?.readers?.slave?.state;
  const isSlaveOnline = Boolean(
    door?.readerConfig?.hasSlave && slaveState && slaveState !== 'READER_DISCONNECTED' && slaveState !== 'BROKEN_SLAVE',
  );
  const targetOptions = BASE_TARGET_OPTIONS.map((opt) =>
    opt.value === FirmwareTarget.Master ? opt : { ...opt, disabled: !isSlaveOnline },
  );

  const masterHardwareVersion = parseHardwareVersion(reported?.readers?.master?.hw_version);
  const slaveHardwareVersion = parseHardwareVersion(reported?.readers?.slave?.hw_version);
  const selectedHardwareVersion = target === FirmwareTarget.Slave ? slaveHardwareVersion : masterHardwareVersion;
  const targetHardwareVersion: HardwareVersion = selectedHardwareVersion ?? HardwareVersion.V6;

  const masterFlashSize = parseFlashSize(
    reported?.readers?.master?.flash_size_mb ?? reported?.readers?.master?.flash_size ?? reported?.system?.flash_size,
  );
  const slaveFlashSize = parseFlashSize(
    reported?.readers?.slave?.flash_size_mb ?? reported?.readers?.slave?.flash_size,
  );
  const masterFlash = masterFlashSize;
  const slaveFlash = slaveFlashSize;
  const selectedFlashSize = target === FirmwareTarget.Slave ? slaveFlashSize : masterFlashSize;
  const targetFlashSize: FlashSize = selectedFlashSize ?? FlashSize.Flash8MB;

  const isMasterHardwareReady = Boolean(masterHardwareVersion && masterFlashSize);
  const isSlaveHardwareReady = Boolean(slaveHardwareVersion && slaveFlashSize && isSlaveOnline);
  const hasReportedHardware =
    target === FirmwareTarget.Both
      ? isMasterHardwareReady && isSlaveHardwareReady
      : target === FirmwareTarget.Slave
        ? isSlaveHardwareReady
        : isMasterHardwareReady;
  const hardwareSummary = `Maestra: V${masterHardwareVersion ?? '—'} (${masterFlashSize ?? '—'})${isSlaveHardwareReady ? ` • Esclava: V${slaveHardwareVersion ?? '—'} (${slaveFlashSize ?? '—'})` : ''}`;
  const targetSummary =
    target === FirmwareTarget.Both
      ? `1° Esclava (V${slaveHardwareVersion ?? '—'} ${slaveFlashSize ?? '—'}) y 2° Maestra (V${masterHardwareVersion ?? '—'} ${masterFlashSize ?? '—'})`
      : `${target === FirmwareTarget.Slave ? 'Esclava' : 'Maestra'} (V${targetHardwareVersion} ${targetFlashSize})`;

  useEffect(() => {
    setTarget(isSlaveOnline ? FirmwareTarget.Both : FirmwareTarget.Master);
    setVersion(DEFAULT_FIRMWARE_VERSION);
    setCustomUrl(false);
  }, [door?.id, isSlaveOnline]);

  const masterUrl =
    masterHardwareVersion && masterFlash
      ? buildDynamicFirmwareUrl({ hardwareVersion: masterHardwareVersion, flashSize: masterFlash, version })
      : '';
  const slaveUrl =
    slaveHardwareVersion && slaveFlash
      ? buildDynamicFirmwareUrl({ hardwareVersion: slaveHardwareVersion, flashSize: slaveFlash, version })
      : '';

  useEffect(() => {
    if (!customUrl) setUrl(target === FirmwareTarget.Slave ? slaveUrl : masterUrl);
  }, [target, masterUrl, slaveUrl, customUrl]);

  const handleUrlChange = (value: string): void => {
    setUrl(value);
    setCustomUrl(true);
  };

  const handleResetUrl = (): void => {
    setCustomUrl(false);
    setUrl(target === FirmwareTarget.Slave ? slaveUrl : masterUrl);
  };

  const handleSend = (): void => {
    if (url.trim() === '' || !hasReportedHardware) {
      return;
    }
    if (target === FirmwareTarget.Both && masterHardwareVersion && masterFlash && slaveHardwareVersion && slaveFlash) {
      onSend({
        url: masterUrl,
        target,
        hw_version: masterHardwareVersion,
        flash_size: masterFlash,
        master: { url: masterUrl, hw_version: masterHardwareVersion, flash_size: masterFlash },
        slave: { url: slaveUrl, hw_version: slaveHardwareVersion, flash_size: slaveFlash },
      });
      return;
    }
    onSend({
      url: url.trim(),
      target,
      hw_version: targetHardwareVersion,
      flash_size: targetFlashSize,
    });
  };

  const isValid = url.trim().length > 0 && hasReportedHardware;

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

        {!hasReportedHardware && (
          <Alert variant="error" title="Telemetría requerida">
            Esta lectora aún no ha reportado su versión de hardware o memoria flash. Espera a que la lectora envíe su
            primera telemetría para habilitar la actualización.
          </Alert>
        )}

        {hasReportedHardware && (
          <div className="rounded-lg border border-(--border) bg-(--surface-sunken) p-3">
            <Text as="p" size="label" tone="muted">
              Hardware detectado: <strong className="text-(--foreground)">{hardwareSummary}</strong>
            </Text>
          </div>
        )}

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
          label={target === FirmwareTarget.Both ? 'URL Binario Maestra (.bin)' : 'URL del binario (.bin)'}
          hint="Ruta generada automáticamente a partir del hardware detectado en memoria. Puedes editarla si usas un servidor manual."
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
            {target === FirmwareTarget.Both && (
              <span className="font-mono text-label text-(--text-muted) break-all">Esclava: {slaveUrl}</span>
            )}
            {customUrl && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  intent="neutral"
                  appearance="ghost"
                  size="sm"
                  onClick={handleResetUrl}
                  disabled={pending}
                  className="underline"
                >
                  Restaurar URL automática
                </Button>
              </div>
            )}
          </div>
        </Field>

        <div className="rounded-lg border border-(--border) bg-(--surface-sunken) p-3">
          <Text as="p" size="label" tone="muted">
            Resumen: Se actualizará <strong className="text-(--foreground)">{targetSummary}</strong> con versión{' '}
            <strong className="text-(--foreground)">{version}</strong>.
          </Text>
        </div>
      </div>
    </Dialog>
  );
}
