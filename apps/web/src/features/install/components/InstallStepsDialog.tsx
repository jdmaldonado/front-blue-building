import { Share, SquarePlus, type LucideIcon } from 'lucide-react';
import { Button, Dialog, Text } from '../../../ui';

type InstallStepsDialogProps = {
  open: boolean;
  appName: string;
  onClose: () => void;
};

type Step = { icon: LucideIcon; text: string };

// The icons are the ones Safari shows, so the person can match them on screen.
const STEPS: Step[] = [
  { icon: Share, text: 'Toca el botón Compartir, abajo o arriba de la pantalla.' },
  { icon: SquarePlus, text: 'Elige "Agregar a inicio". Si no lo ves, desliza la lista hacia arriba.' },
];

export function InstallStepsDialog({ open, appName, onClose }: InstallStepsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={`Instala ${appName}`}
      description="En iPhone y iPad se instala desde el menú Compartir."
      footer={<Button onClick={onClose}>Entendido</Button>}
    >
      <ol className="flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li key={step.text} className="flex items-start gap-3">
            <span className="flex size-10 flex-none items-center justify-center rounded-(--radius-2) bg-(--accent-subtle) text-(--accent)">
              <step.icon size={22} aria-hidden />
            </span>
            <Text className="pt-2">
              {index + 1}. {step.text}
            </Text>
          </li>
        ))}
        <li className="flex items-start gap-3">
          <span className="size-10 flex-none" />
          <Text tone="secondary">Listo: la app queda en tu pantalla de inicio, como cualquier otra.</Text>
        </li>
      </ol>
    </Dialog>
  );
}
