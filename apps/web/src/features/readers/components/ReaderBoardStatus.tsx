import { readerHealthFromState } from '@bb/core';
import { StatusDot, Text } from '../../../ui';
import { READER_HEALTH_META } from '../lib';

type ReaderBoardStatusProps = {
  // "Maestra" or "Esclava": the two boards of one reader.
  title: string;
  state: string | null | undefined;
  spiOk: boolean | null | undefined;
  isConfigured?: boolean;
};

// Offline is red and not the grey `offline` dot: that grey belongs to a closed
// door, which is normal. A reader that fell off the bus is a fault.
const DOT_STATE = {
  ONLINE: 'online',
  BUSY: 'online',
  WARNING: 'warning',
  ALERT: 'alert',
  OFFLINE: 'alert',
  UNKNOWN: 'unknown',
} as const;

// One board: how it is, and whether its chip bus answers. The SPI matters on its
// own — a reader can be online and still not read a single card.
export function ReaderBoardStatus({ title, state, spiOk, isConfigured = true }: ReaderBoardStatusProps) {
  const health = readerHealthFromState(state);
  const meta = READER_HEALTH_META[health];
  const label = isConfigured ? meta.label : 'No configurada';
  const dotState = isConfigured ? DOT_STATE[health] : 'unknown';

  return (
    // Fixed columns: the labels change on every frame, and without a reserved
    // width the whole row jumps sideways each time one arrives.
    <div className="flex min-w-0 items-center gap-3">
      <Text as="span" size="label" weight="medium" className="w-14 flex-none">
        {title}
      </Text>

      <span className="flex w-32 flex-none items-center gap-1.5">
        <StatusDot state={dotState} halo={isConfigured && meta.pulse} />
        <Text as="span" size="body-sm" tone="secondary" truncate>
          {label}
        </Text>
      </span>

      <span className="flex flex-none items-center gap-1.5">
        <Text as="span" size="label" tone="muted">
          SPI
        </Text>
        <StatusDot state={spiOk === true ? 'online' : spiOk === false ? 'alert' : 'unknown'} />
        <Text as="span" size="body-sm" tone="secondary" className="w-10">
          {spiOk === true ? 'OK' : spiOk === false ? 'Error' : '—'}
        </Text>
      </span>
    </div>
  );
}
