import type { ReaderState } from '@bb/core';
import { Text } from '../../../ui';
import { formatBytes, formatUptime } from '../lib';
import { ReaderBoardStatus } from './ReaderBoardStatus';

type ReaderDiagnosticsProps = {
  reported: ReaderState | null;
};

type Entry = { label: string; value: string };

// Everything the reader tells about itself. Read only: none of it can be
// written back, and most of it is not in the config either.
export function ReaderDiagnostics({ reported }: ReaderDiagnosticsProps) {
  if (reported === null) {
    return (
      <div className="border border-(--card-border) bg-(--surface-sunken) px-4 py-3">
        <Text size="body-sm" tone="secondary">
          Todavía no hemos recibido nada de esta lectora. Solo reporta cuando algo cambia, así que el silencio no
          significa que esté caída.
        </Text>
      </div>
    );
  }

  const master = reported.readers?.master;
  const slave = reported.readers?.slave;
  const system = reported.system;
  const network = system?.network;

  const entries: Entry[] = [];
  const add = (label: string, value: string | number | null | undefined, suffix = ''): void => {
    if (value !== null && value !== undefined && value !== '') {
      entries.push({ label, value: `${value}${suffix}` });
    }
  };

  add('ID del dispositivo', reported.metadata?.device_id);
  add('Modo', master?.device_mode);
  add('Firmware maestra', master?.firmware_version);
  add('Hardware maestra', master?.hw_version);
  add('Firmware esclava', slave?.firmware_version);
  add('Red', network?.wifi_ssid);
  add('Señal', network?.rssi, ' dBm');
  add(
    'Encendida desde',
    system?.uptime_sec === null || system?.uptime_sec === undefined ? null : formatUptime(system.uptime_sec),
  );
  add('Temperatura', system?.cpu_temp, ' °C');
  add(
    'Memoria libre',
    system?.free_heap_bytes === null || system?.free_heap_bytes === undefined
      ? null
      : formatBytes(system.free_heap_bytes),
  );
  add('Flash', system?.flash_size);
  add('Esclava vista hace', slave?.last_seen_sec, ' s');

  return (
    <div className="flex flex-col gap-3 border border-(--card-border) bg-(--surface-sunken) px-4 py-3">
      <div className="flex flex-col gap-1.5">
        <ReaderBoardStatus title="Maestra" state={master?.state} spiOk={master?.spi_ok} />
        <ReaderBoardStatus title="Esclava" state={slave?.state} spiOk={slave?.spi_ok} />
      </div>

      {entries.length === 0 ? null : (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.label} className="flex min-w-0 flex-col">
              <dt className="text-caption text-(--text-muted)">{entry.label}</dt>
              <dd className="truncate font-mono text-body-sm">{entry.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
