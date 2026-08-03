import { Siren } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from '../../../ui';
import { useUserEventActions } from '../hooks/useUserEventActions';
import { EventsDialog } from './EventsDialog';

type BuildingEventsButtonProps = {
  buildingId: string;
};

// Always within reach, like the panic button of the current app.
export function BuildingEventsButton({ buildingId }: BuildingEventsButtonProps) {
  const [open, setOpen] = useState(false);
  const controller = useUserEventActions(buildingId);

  return (
    <>
      <IconButton label="Reportar un evento" tone="destructive" onClick={() => setOpen(true)}>
        <Siren size={18} />
      </IconButton>

      <EventsDialog open={open} onClose={() => setOpen(false)} controller={controller} />
    </>
  );
}
