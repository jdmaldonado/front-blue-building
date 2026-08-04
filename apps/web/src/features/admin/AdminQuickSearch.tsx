import { QuickSearch } from './components';
import { useQuickSearch } from './hooks';

// Mounted once for the whole panel: the shortcut works on every admin screen.
export function AdminQuickSearch() {
  const search = useQuickSearch();
  return <QuickSearch open={search.open} onClose={search.close} />;
}
