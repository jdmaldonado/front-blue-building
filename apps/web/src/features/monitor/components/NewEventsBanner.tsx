import { ArrowUp } from 'lucide-react';
import { Button, Text } from '../../../ui';

type NewEventsBannerProps = {
  count: number;
  onRefresh: () => void;
};

// Nothing moves under the reader's hands: it says how many arrived and waits.
export function NewEventsBanner({ count, onRefresh }: NewEventsBannerProps) {
  if (count === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border border-(--accent) bg-(--accent-subtle) px-4 py-2.5">
      <ArrowUp size={16} aria-hidden className="text-(--accent)" />
      <Text as="span" size="body-sm" weight="medium">
        {count === 1 ? 'Pasó algo nuevo en el edificio' : `Pasaron ${count} cosas nuevas en el edificio`}
      </Text>
      <Button size="sm" onClick={onRefresh} className="ml-auto">
        Actualizar
      </Button>
    </div>
  );
}
