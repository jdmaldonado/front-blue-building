import { Button, Dialog } from '../../../ui';
import { TermsContent } from './TermsContent';

type TermsDialogProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export function TermsDialog({ open, onClose, onAccept }: TermsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Condiciones de servicio"
      description="Léelas antes de usar los servicios del edificio."
      size="lg"
      footer={
        <>
          <Button appearance="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            onClick={() => {
              onAccept();
              onClose();
            }}
          >
            Acepto los términos
          </Button>
        </>
      }
    >
      <TermsContent />
    </Dialog>
  );
}
