import { Text } from '../../../ui';

type AuthHeadingProps = {
  title: string;
  description: string;
};

// Every auth screen opens the same way; the layout only provides the frame.
export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-title-lg font-bold tracking-tight md:text-display">{title}</h1>
      <Text as="span" tone="secondary">
        {description}
      </Text>
    </div>
  );
}
