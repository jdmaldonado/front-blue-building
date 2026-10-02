import { Text, cn } from '../../../ui';

type AuthHeadingProps = {
  title: string;
  description: string;
  // Follows the logo when it is the headline of the screen.
  centered?: boolean;
};

// Every auth screen opens the same way; the layout only provides the frame.
export function AuthHeading({ title, description, centered = false }: AuthHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-1', centered ? 'text-center' : '')}>
      <h1 className="font-display text-title-lg font-bold tracking-tight md:text-display">{title}</h1>
      <Text as="span" tone="secondary">
        {description}
      </Text>
    </div>
  );
}
