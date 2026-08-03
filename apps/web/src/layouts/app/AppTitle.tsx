import { Text } from '../../ui';

type AppTitleProps = {
  title: string;
  subtitle?: string;
};

export function AppTitle({ title, subtitle }: AppTitleProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <Text as="h1" size="title-sm" weight="bold" truncate>
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
