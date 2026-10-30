import type { Door, ReaderState } from '@bb/core';

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
