// The API returns these lists in insertion order, which means nothing to the
// person reading them. `numeric` keeps "Piso 2" before "Piso 10": plain
// alphabetical order sorts them the other way round.
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

export function sortByLabel<TOption extends { label: string }>(options: readonly TOption[]): TOption[] {
  return [...options].sort((left, right) => collator.compare(left.label, right.label));
}
