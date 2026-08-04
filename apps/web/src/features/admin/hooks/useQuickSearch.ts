import { useEffect, useState } from 'react';

export interface QuickSearchState {
  open: boolean;
  close: () => void;
}

// Ctrl+K, or Cmd+K on a Mac.
export function useQuickSearch(): QuickSearchState {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, close: () => setOpen(false) };
}
