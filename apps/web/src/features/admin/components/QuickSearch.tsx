import { useBuildings } from '@bb/logic';
import { useNavigate } from '@tanstack/react-router';
import { Building2, Search } from 'lucide-react';
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { AppRoute } from '../../../app/navigation';
import { Dialog, EmptyState, Input, Text, cn } from '../../../ui';

type QuickSearchProps = {
  open: boolean;
  onClose: () => void;
};

const MAX_RESULTS = 8;

// Jump to any building by typing. With many buildings this saves more time than
// any menu.
export function QuickSearch({ open, onClose }: QuickSearchProps) {
  const buildings = useBuildings();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlighted(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const all = buildings.data ?? [];
    const matches =
      term === ''
        ? all
        : all.filter((building) => `${building.name} ${building.city ?? ''}`.toLowerCase().includes(term));
    return matches.slice(0, MAX_RESULTS);
  }, [buildings.data, query]);

  function go(index: number): void {
    const building = results[index];
    if (building === undefined) {
      return;
    }
    onClose();
    void navigate({ to: AppRoute.AdminBuilding, params: { buildingId: building.id } });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlighted((current) => (current + step + results.length) % Math.max(results.length, 1));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      go(highlighted);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} size="md" title="Ir a un edificio" description="Escribe para buscar">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-muted)" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Nombre o ciudad"
            aria-label="Buscar edificio"
            className="pl-9"
          />
        </div>

        {results.length === 0 ? (
          <EmptyState padding="sm" icon={Building2} title="Sin resultados" />
        ) : (
          <ul className="flex flex-col gap-1">
            {results.map((building, index) => (
              <li key={building.id}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => go(index)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-(--radius-2) px-3 py-2 text-left',
                    index === highlighted ? 'bg-(--menu-hover)' : '',
                  )}
                >
                  <Building2 size={16} aria-hidden className="shrink-0 text-(--text-muted)" />
                  <span className="flex min-w-0 flex-col">
                    <Text as="span" size="body-sm" weight="medium" truncate>
                      {building.name}
                    </Text>
                    {building.city === null || building.city === undefined ? null : (
                      <Text as="span" size="caption" tone="muted" truncate>
                        {building.city}
                      </Text>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
