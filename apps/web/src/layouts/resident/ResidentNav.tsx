import { useState } from 'react';
import { EventsDialog, useUserEventActions } from '../../features/building-events';
import { ResidentBottomBar } from './ResidentBottomBar';
import { ResidentMenuPanel } from './ResidentMenuPanel';

type ResidentNavProps = {
  buildingId: string;
};

// Everything the resident reaches from the bottom bar. The same at every
// width: the current app has no second navigation and neither does this one.
export function ResidentNav({ buildingId }: ResidentNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const events = useUserEventActions(buildingId);

  return (
    <>
      <ResidentBottomBar onOpenEvents={() => setEventsOpen(true)} onOpenMenu={() => setMenuOpen(true)} />
      <ResidentMenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
      <EventsDialog open={eventsOpen} onClose={() => setEventsOpen(false)} controller={events} />
    </>
  );
}
