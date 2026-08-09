import type { SelectOption } from './Select';

// Anything the API returns as a row with a name: buildings, towers, floors,
// apartments, doors.
export interface NamedItem {
  id: string;
  name?: string | null;
}

export interface SelectOptionsConfig<TItem extends NamedItem> {
  // Goes first and is never sorted: the placeholder, or an "all" option.
  first?: SelectOption<string>;
  // Used when the row has no name. Without it the id shows.
  fallbackLabel?: (item: TItem) => string;
  // Off for lists that already come in a meaningful order.
  sorted?: boolean;
}

// `numeric` keeps "Piso 2" before "Piso 10": plain alphabetical order sorts them
// the other way round. Accents follow Spanish rules.
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

export function sortOptionsByLabel<TOption extends { label: string }>(options: readonly TOption[]): TOption[] {
  return [...options].sort((left, right) => collator.compare(left.label, right.label));
}

// The API returns these lists in insertion order, which means nothing to the
// person reading them.
export function toSelectOptions<TItem extends NamedItem>(
  items: readonly TItem[],
  config: SelectOptionsConfig<TItem> = {},
): ReadonlyArray<SelectOption<string>> {
  const options = items.map((item) => ({
    value: item.id,
    label: item.name ?? config.fallbackLabel?.(item) ?? item.id,
  }));
  const ordered = config.sorted === false ? options : sortOptionsByLabel(options);

  return config.first === undefined ? ordered : [config.first, ...ordered];
}
