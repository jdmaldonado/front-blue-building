import {
  DEFAULT_MASTER_HARDWARE,
  DEFAULT_SLAVE_HARDWARE,
  LOGIC_FIELDS,
  ReaderTarget,
  defaultLogicConfig,
  type Door,
  type ReaderConfig,
  type ReaderHardwareConfig,
  type ReaderLogicConfig,
  type ReaderState,
} from '@bb/core';
import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, Field, Input, Switch, Tabs, Text, type RadioOption } from '../../../ui';
import { RadioGroup } from '../../../ui';
import { NumericField } from './NumericField';
import { ReaderDiagnostics } from './ReaderDiagnostics';

type ReaderConfigDialogProps = {
  door: Door | null;
  // What the reader is reporting right now. The only values we can read back.
  reported: ReaderState | null;
  pending: boolean;
  onClose: () => void;
  onSend: (config: ReaderConfig) => void;
};

const SECTIONS = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'logic', label: 'Tiempos' },
  { value: 'network', label: 'Red' },
  { value: 'identity', label: 'Identidad' },
] as const;
type Section = (typeof SECTIONS)[number]['value'];

const targetOptions: ReadonlyArray<RadioOption<ReaderTarget>> = [
  { value: ReaderTarget.Master, label: 'Maestra' },
  { value: ReaderTarget.Slave, label: 'Esclava' },
];

export function ReaderConfigDialog({ door, reported, pending, onClose, onSend }: ReaderConfigDialogProps) {
  const [target, setTarget] = useState<ReaderTarget>(ReaderTarget.Master);
  const [section, setSection] = useState<Section>('hardware');
  const [hardware, setHardware] = useState<ReaderHardwareConfig>(DEFAULT_MASTER_HARDWARE);
  const [logic, setLogic] = useState<ReaderLogicConfig>(defaultLogicConfig);
  const [ssid, setSsid] = useState('');
  const [deviceId, setDeviceId] = useState('');

  // The form always starts from the defaults: there is no way to read what the
  // reader currently has.
  useEffect(() => {
    setHardware(target === ReaderTarget.Master ? DEFAULT_MASTER_HARDWARE : DEFAULT_SLAVE_HARDWARE);
  }, [target]);

  // Wifi and device id are the two things telemetry does tell us, so they start
  // from what the reader reports instead of from an empty box.
  useEffect(() => {
    if (door === null) {
      setTarget(ReaderTarget.Master);
      setSection('hardware');
      setLogic(defaultLogicConfig());
    }
    setSsid(reported?.system?.network?.wifi_ssid ?? '');
    setDeviceId(
      reported?.metadata?.device_id === null || reported?.metadata?.device_id === undefined
        ? ''
        : String(reported.metadata.device_id),
    );
  }, [door, reported]);

  const hardwareEntries = useMemo(() => Object.entries(hardware), [hardware]);
  const isMaster = target === ReaderTarget.Master;

  const send = (): void => {
    if (section === 'network') {
      onSend({ target: ReaderTarget.Master, wifi: { ssid: ssid.trim() } });
      return;
    }
    if (section === 'identity') {
      onSend({ target: ReaderTarget.Master, logic: { device_id: Number(deviceId) } });
      return;
    }
    onSend({ target, hardware, ...(isMaster ? { logic } : {}) });
  };

  const canSend =
    section === 'network' ? ssid.trim() !== '' : section === 'identity' ? /^\d+$/.test(deviceId.trim()) : true;

  return (
    <Dialog
      open={door !== null}
      onClose={onClose}
      size="lg"
      title="Configurar lectora"
      description={door?.name ?? undefined}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={send} loading={pending} disabled={!canSend}>
            Enviar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <ReaderDiagnostics reported={reported} />

        {section === 'network' || section === 'identity' ? null : (
          <RadioGroup
            options={targetOptions}
            value={target}
            onChange={setTarget}
            label="Placa"
            appearance="segmented"
          />
        )}

        <Tabs items={SECTIONS} value={section} onChange={setSection} label="Sección de la configuración" />

        {section === 'hardware' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {hardwareEntries.map(([key, value]) =>
              typeof value === 'boolean' ? (
                <Switch
                  key={key}
                  checked={value}
                  onChange={(checked) => setHardware((current) => ({ ...current, [key]: checked }))}
                  label={key}
                  labelPosition="start"
                />
              ) : (
                <Field key={key} label={key} htmlFor={`hardware-${key}`}>
                  <Input
                    id={`hardware-${key}`}
                    value={String(value)}
                    onChange={(event) =>
                      setHardware((current) => ({ ...current, [key]: Number(event.target.value.replace(/\D/g, '')) }))
                    }
                    inputMode="numeric"
                    className="font-mono"
                  />
                </Field>
              ),
            )}
          </div>
        ) : null}

        {section === 'logic' ? (
          isMaster ? (
            <div className="flex flex-col gap-4">
              {LOGIC_FIELDS.map((field) => (
                <NumericField
                  key={field.key}
                  field={field}
                  value={logic[field.key] ?? field.defaultValue}
                  onChange={(value) => setLogic((current) => ({ ...current, [field.key]: value }))}
                />
              ))}
            </div>
          ) : (
            <Text tone="secondary">Los tiempos solo existen en la placa maestra.</Text>
          )
        ) : null}

        {section === 'network' ? (
          <Field label="Nombre de la red" htmlFor="reader-ssid" hint="Se envía siempre a la placa maestra.">
            <Input id="reader-ssid" value={ssid} onChange={(event) => setSsid(event.target.value)} autoComplete="off" />
          </Field>
        ) : null}

        {section === 'identity' ? (
          <Field label="ID del dispositivo" htmlFor="reader-device-id" hint="Se envía siempre a la placa maestra.">
            <Input
              id="reader-device-id"
              value={deviceId}
              onChange={(event) => setDeviceId(event.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              autoComplete="off"
              className="font-mono"
            />
          </Field>
        ) : null}

        <Text size="body-sm" tone="secondary">
          {section === 'network' || section === 'identity'
            ? 'Este valor es el que la lectora está reportando ahora mismo.'
            : 'Hardware y tiempos parten de los valores por defecto: la lectora no reporta qué tiene puesto.'}
        </Text>
      </div>
    </Dialog>
  );
}
