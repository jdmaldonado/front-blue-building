import { useState } from 'react';
import { EventsDialog, useUserEventActions } from '../../features/building-events';
import { ResidentBottomBar } from './ResidentBottomBar';
import { ResidentMenuPanel } from './ResidentMenuPanel';

type ResidentMobileNavProps = {
  buildingId: string;
};

// Everything the resident reaches from the bottom of a phone screen. On a
// desktop the sidebar of the shell covers the same ground.
export function ResidentMobileNav({ buildingId }: ResidentMobileNavProps) {
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
