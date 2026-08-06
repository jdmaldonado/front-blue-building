import { ReaderHealth } from '@bb/core';
import { StatusDot, Tooltip } from '../../../ui';
import { READER_HEALTH_META } from '../lib';

type ReaderHealthDotProps = {
  health: ReaderHealth;
};

// Same reason as in `ReaderBoardStatus`: a disconnected reader is a fault, so it
// is red and not the neutral grey of a closed door.
const DOT_STATE = {
  [ReaderHealth.Online]: 'online',
  [ReaderHealth.Busy]: 'online',
  [ReaderHealth.Warning]: 'warning',
  [ReaderHealth.Alert]: 'alert',
  [ReaderHealth.Offline]: 'alert',
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
