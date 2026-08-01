import { Logo } from '../../ui';

// Left column of the login screen, full height from the top-left corner. Dark in
// both themes (brand-* tokens do not flip), with the honeycomb over a gradient.
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
      <Logo size="lg" markClassName="text-(--brand-accent)" />

      <div className="flex max-w-[380px] flex-col gap-3">
        <h2 className="font-display text-display leading-tight font-bold tracking-tight lg:text-display-lg">
          Control de acceso para tu edificio.
        </h2>
        <p className="text-body leading-relaxed text-(--brand-muted) lg:text-body-lg">
          Puertas, tarjetas RFID y alarmas, administradas desde un solo lugar.
        </p>
      </div>

      <span className="font-mono text-caption tracking-wider text-(--brand-muted)">BLUE BUILDING</span>
    </div>
  );
}
