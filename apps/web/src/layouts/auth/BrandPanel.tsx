import { Logo, Text } from '../../ui';

// Stays dark in both themes: the brand-* tokens do not flip.
export function BrandPanel() {
  return (
    <div
      className={[
        'hidden w-[38%] max-w-[460px] min-w-[300px] flex-none flex-col justify-between p-10 lg:p-14',
        'bg-(--brand-surface) text-(--brand-foreground)',
        'bg-[image:var(--brand-gradient),var(--pattern-honeycomb)] bg-[length:auto,39px_22.52px]',
        'md:flex',
      ].join(' ')}
    >
      <Logo size="xl" className="text-(--brand-accent)" />

      <div className="flex max-w-[380px] flex-col gap-3">
        <Text as="h2" size="display" weight="bold" tone="inherit">
          Control de acceso para tu edificio.
        </Text>
        <Text tone="inherit" className="leading-relaxed text-(--brand-muted)">
          Puertas, tarjetas RFID y alarmas, administradas desde un solo lugar.
        </Text>
      </div>

      <Text as="span" size="caption" tone="inherit" className="font-mono tracking-wider text-(--brand-muted)">
        BLUE BUILDING
      </Text>
    </div>
  );
}
