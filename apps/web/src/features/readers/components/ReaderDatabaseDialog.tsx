import type { Door, ReaderState } from '@bb/core';
import { RefreshCw } from 'lucide-react';
import { Button, Dialog, Text } from '../../../ui';
import { formatChecksum } from '../lib';

export interface ReaderDatabaseDialogProps {
  door: Door | null;
  reported: ReaderState | null;
  masterChecksum?: string | null;
  slaveChecksum?: string | null;
  pending: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onRead: () => void;
  onDelete: () => void;
}

export function ReaderDatabaseDialog(props: ReaderDatabaseDialogProps) {
  const { door, pending, onClose } = props;
  const footer = (
    <Button appearance="ghost" intent="neutral" onClick={onClose} disabled={pending}>
      Cerrar
    </Button>
  );
  const description = door?.name ? `${door.name} (${door.localId ?? ''})` : 'Lectora';
  return (
    <Dialog
      open={door !== null}
      onClose={onClose}
      size="md"
      title="Base de datos local"
      description={description}
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        <div className="border border-(--card-border) bg-(--surface-sunken) p-3 font-mono text-xs">
          <Text size="body-sm" weight="medium">
            Tarjetas locales
          </Text>
          <span>M: {formatChecksum(props.masterChecksum ?? props.reported?.readers?.master?.db_checksum)}</span>
          {Boolean(door?.readerConfig?.hasSlave) && (
            <span className="ml-4">
              E: {formatChecksum(props.slaveChecksum ?? props.reported?.readers?.slave?.db_checksum)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button intent="primary" onClick={props.onUpdate} disabled={pending}>
            <RefreshCw size={16} />
            Actualizar base de datos
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
