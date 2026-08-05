import type { LogicField } from '@bb/core';
import { Field, Input, Text } from '../../../ui';
import { formatDuration } from '../lib';

type NumericFieldProps = {
  field: LogicField;
  value: number;
  onChange: (value: number) => void;
};

// Whole non-negative numbers only, clamped to the field's own limits, with the
// readable conversion next to it.
export function NumericField({ field, value, onChange }: NumericFieldProps) {
  const inputId = `reader-logic-${field.key}`;

  const handleChange = (raw: string): void => {
    const digits = raw.replace(/\D/g, '');
    onChange(digits === '' ? field.min : Number(digits));
  };

  // Clamping on blur and not while typing: doing it on every keystroke fights
  // whoever is halfway through a longer number.
  const handleBlur = (): void => {
    onChange(Math.min(field.max, Math.max(field.min, value)));
  };

  return (
    <Field label={field.label} htmlFor={inputId} hint={field.help}>
      <div className="flex items-center gap-3">
        <Input
          id={inputId}
          value={String(value)}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          inputMode="numeric"
          autoComplete="off"
          className="w-28 font-mono"
        />
        <Text as="span" size="body-sm" tone="muted">
          {formatDuration(value, field.unit)}
        </Text>
      </div>
    </Field>
  );
}
