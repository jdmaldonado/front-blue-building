import type { LucideIcon } from 'lucide-react';
import { Text } from '../../../ui';

type AccountFieldProps = {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
};

// One row of the profile. Returns nothing when the API has no value, so the
// screen never shows an empty line.
export function AccountField({ icon: Icon, label, value }: AccountFieldProps) {
  if (value === null || value === undefined || value.trim() === '') {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-(--text-muted)" aria-hidden />
      <div className="flex min-w-0 flex-col">
        <Text as="span" size="caption" tone="muted">
          {label}
        </Text>
        <Text as="span" size="body-sm">
          {value}
        </Text>
      </div>
    </div>
  );
}
