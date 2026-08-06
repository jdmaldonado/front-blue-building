import type { ReaderTelemetry } from '@bb/logic';
import { Button, Dialog, Text } from '../../../ui';
import { ReaderBoardStatus } from './ReaderBoardStatus';
import { ReaderDiagnostics } from './ReaderDiagnostics';

type ReaderTelemetryDialogProps = {
  open: boolean;
  // Name of the door the reader belongs to.
  doorName: string;
  telemetry: ReaderTelemetry | null;
  onClose: () => void;
};

// The hardware of one door, without leaving the screen you are on. Same idea as
// looking at someone's cards from the users table.
export function ReaderTelemetryDialog({ open, doorName, telemetry, onClose }: ReaderTelemetryDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="md"
      title="Estado del equipo"
      description={doorName}
      footer={
        <Button appearance="ghost" intent="neutral" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {telemetry === null ? (
          <ReaderDiagnostics reported={null} />
        ) : telemetry.state === null ? (
          // The flat fields arrived without the nested report: enough for the
          // boards, not enough for versions or metrics.
          <div className="flex flex-col gap-1.5 border border-(--card-border) bg-(--surface-sunken) px-4 py-3">
            <ReaderBoardStatus title="Maestra" state={telemetry.masterStatus} spiOk={telemetry.masterSpiOk} />
            <ReaderBoardStatus title="Esclava" state={telemetry.slaveStatus} spiOk={telemetry.slaveSpiOk} />
          </div>
        ) : (
          <ReaderDiagnostics reported={telemetry.state} />
        )}

        <Text size="body-sm" tone="secondary">
          Esto es el equipo, no la puerta. Una lectora puede estar en línea y la puerta abierta, o al revés.
        </Text>
      </div>
    </Dialog>
  );
}
