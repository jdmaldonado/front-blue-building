import { CardReaderStatus } from '@bb/core';
import { CircleCheck, CreditCard, TriangleAlert } from 'lucide-react';
import { CornerBrackets, Spinner, Text } from '../../../ui';

type CardScanAreaProps = {
  status: CardReaderStatus;
  secondsLeft: number;
  tag: string;
};

// The one place the scan line belongs: an area that is literally waiting for a
// card to be read.
export function CardScanArea({ status, secondsLeft, tag }: CardScanAreaProps) {
  return (
    <div className="relative flex h-40 flex-col items-center justify-center gap-2 overflow-hidden border border-(--card-border) bg-(--surface-sunken) px-4 text-center">
      <CornerBrackets tone={status === CardReaderStatus.Waiting ? 'accent' : 'muted'} />

      {status === CardReaderStatus.Waiting ? (
        <span aria-hidden className="absolute inset-x-0 top-0 h-px animate-scan bg-(--scan-line)" />
      ) : null}

      {status === CardReaderStatus.Preparing ? (
        <>
          <Spinner size="md" />
          <Text size="body-sm" tone="secondary">
            Preparando la lectora...
          </Text>
        </>
      ) : null}

      {status === CardReaderStatus.Waiting ? (
        <>
          <CreditCard size={28} aria-hidden className="text-(--accent)" />
          <Text weight="medium">Pasa la tarjeta por la lectora</Text>
          <Text size="body-sm" tone="muted" className="font-mono">
            {secondsLeft} s
          </Text>
        </>
      ) : null}

      {status === CardReaderStatus.Read ? (
        <>
          <CircleCheck size={28} aria-hidden className="text-(--success)" />
          <Text weight="medium">Tarjeta leída</Text>
          <Text size="body-sm" tone="muted" className="font-mono">
            {tag}
          </Text>
        </>
      ) : null}

      {status === CardReaderStatus.Failed ? (
        <>
          <TriangleAlert size={28} aria-hidden className="text-(--destructive)" />
          <Text weight="medium">La lectora no respondió</Text>
          <Text size="body-sm" tone="secondary">
            Revisa que el equipo del edificio esté conectado, o escribe el número a mano.
          </Text>
        </>
      ) : null}

      {status === CardReaderStatus.Idle ? (
        <>
          <CreditCard size={28} aria-hidden className="text-(--text-muted)" />
          <Text size="body-sm" tone="secondary">
            Elige una puerta y configura su lectora, o escribe el número a mano.
          </Text>
        </>
      ) : null}
    </div>
  );
}
