import type { Logger } from '@bb/logger';
import type { z } from 'zod';

export interface RowsRead<TItem> {
  items: TItem[];
  skipped: number;
}

export interface ReadRowsOptions {
  logger: Logger;
  // Both go to the log, so a dropped row can be traced back.
  path: string;
  label: string;
}

// Reads a list one row at a time. A row we cannot read costs that row and not
// the whole screen, and its reason goes to the log, which is where it gets
// fixed. The count of dropped rows travels with the list so the screen can say
// it is incomplete.
export function readRows<TItem>(
  rows: readonly unknown[],
  schema: z.ZodType<TItem>,
  options: ReadRowsOptions,
): RowsRead<TItem> {
  const items: TItem[] = [];
  let skipped = 0;

  for (const row of rows) {
    const parsed = schema.safeParse(row);
    if (parsed.success) {
      items.push(parsed.data);
      continue;
    }
    skipped += 1;
    options.logger.warn(`${options.label} record dropped`, { path: options.path, issues: parsed.error.issues });
  }

  return { items, skipped };
}
