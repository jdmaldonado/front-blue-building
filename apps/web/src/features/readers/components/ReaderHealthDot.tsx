import { ReaderHealth } from '@bb/core';
import { StatusDot, Tooltip } from '../../../ui';
import { READER_HEALTH_META } from '../lib';

type ReaderHealthDotProps = {
  health: ReaderHealth;
};

const DOT_STATE = {
  [ReaderHealth.Online]: 'online',
  [ReaderHealth.Busy]: 'online',
  [ReaderHealth.Warning]: 'warning',
  [ReaderHealth.Alert]: 'alert',
  [ReaderHealth.Offline]: 'offline',
  [ReaderHealth.Unknown]: 'unknown',
} as const;

// Reads the telemetry already cached for the building. Unknown is the normal
// answer for a building nobody has opened yet, not a fault.
export function ReaderHealthDot({ health }: ReaderHealthDotProps) {
  const meta = READER_HEALTH_META[health];
  const label = health === ReaderHealth.Unknown ? 'Sin datos de las lectoras' : `Lectoras: ${meta.label.toLowerCase()}`;

  return (
    <Tooltip content={label}>
      <StatusDot state={DOT_STATE[health]} label={label} halo={meta.pulse} />
    </Tooltip>
  );
}
