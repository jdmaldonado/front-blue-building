import type { Door, ReaderState } from '@bb/core';
import { Button, Dialog } from '../../../ui';

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
  return <Dialog open={door !== null} onClose={onClose} size="md" title="Base de datos local" footer={footer} />;
}
