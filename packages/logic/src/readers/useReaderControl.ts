import type { DomainError, ReaderConfig } from '@bb/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useServices } from '../services/context';

export interface ReaderControlCallbacks {
  onSuccess: (message: ReaderCommand) => void;
  onError: (command: ReaderCommand, error: DomainError) => void;
}

export const ReaderCommand = {
  Reboot: 'REBOOT',
  Config: 'CONFIG',
} as const;
export type ReaderCommand = (typeof ReaderCommand)[keyof typeof ReaderCommand];

export interface ReaderControl {
  // Which command is in flight, if any. Only one at a time: rebooting a reader
  // while sending it a config helps nobody.
  pending: ReaderCommand | null;
  reboot: (localId: string) => void;
  configure: (localId: string, config: ReaderConfig) => void;
}

export function useReaderControl(buildingId: string, callbacks: ReaderControlCallbacks): ReaderControl {
  const { socketClient } = useServices();
  const [pending, setPending] = useState<ReaderCommand | null>(null);
  const cancel = useRef<(() => void) | null>(null);
  const latest = useRef(callbacks);
  latest.current = callbacks;

  const run = useCallback(
    (
      command: ReaderCommand,
      start: (done: { onSuccess: () => void; onError: (e: DomainError) => void }) => () => void,
    ) => {
      cancel.current?.();
      setPending(command);
      cancel.current = start({
        onSuccess: () => {
          setPending(null);
          cancel.current = null;
          latest.current.onSuccess(command);
        },
        onError: (error) => {
          setPending(null);
          cancel.current = null;
          latest.current.onError(command, error);
        },
      });
    },
    [],
  );

  useEffect(() => () => cancel.current?.(), []);

  return {
    pending,
    reboot: (localId) => run(ReaderCommand.Reboot, (done) => socketClient.rebootReader({ buildingId, localId }, done)),
    configure: (localId, config) =>
      run(ReaderCommand.Config, (done) => socketClient.configureReader({ buildingId, localId, config }, done)),
  };
}
