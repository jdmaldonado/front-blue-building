import { Text } from '../../ui';

type AppTitleProps = {
  title: string;
  subtitle?: string;
  // The resident screens wear the brand colour on their titles, the way the
  // current app does. The panel stays in plain ink.
  brand?: boolean;
};

export function AppTitle({ title, subtitle, brand = false }: AppTitleProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <Text as="h1" size="subtitle" weight="bold" tone={brand ? 'accent' : 'primary'} truncate>
        {title}
      </Text>
      {subtitle === undefined ? null : (
        <Text as="span" size="caption" tone="muted" truncate>
          {subtitle}
        </Text>
      )}
    </div>
  );
}
