import { X } from 'lucide-react';
import { useState } from 'react';
import { currentApp } from '../../../app/appIdentity';
import { Button, IconButton, Text, cn } from '../../../ui';
import { useInstallBanner } from '../hooks/useInstallBanner';
import { InstallStepsDialog } from './InstallStepsDialog';

type InstallBannerProps = {
  // On the brand gradient of the resident login. There the regular buttons
  // stay dark, so it takes the white slanted one of that screen.
  onBrand?: boolean;
  className?: string;
};

// A strip at the bottom of the screen until the app is installed or the
// person closes it. Laid out in the flow, so it never covers anything.
export function InstallBanner({ onBrand = false, className }: InstallBannerProps) {
  const banner = useInstallBanner();
  const [stepsOpen, setStepsOpen] = useState(false);
  const app = currentApp();

  if (!banner.visible) {
    return null;
  }

  return (
    // Two rows on a phone, so the button gets the full width; one row from sm.
    <aside
      aria-label="Instalar la app"
      className={cn(
        'flex flex-none flex-wrap items-center gap-3 border-(--border-default) border-t px-4 py-3',
        className,
      )}
    >
      <img
        src={`${app.icons}/icon-192.png`}
        alt=""
        className="size-10 flex-none rounded-(--radius-2) ring-1 ring-(--border-default)"
      />
      <div className="min-w-0 flex-1">
        <Text weight="semibold">Instala la app</Text>
        <Text size="body-sm" tone="secondary">
          Ábrela desde tu pantalla de inicio.
        </Text>
      </div>
      <IconButton label="Ahora no" tone="accent" onClick={banner.dismiss} className="sm:order-last">
        <X size={18} />
      </IconButton>
      <Button
        shape={onBrand ? 'slanted' : 'straight'}
        onClick={banner.manualSteps ? () => setStepsOpen(true) : banner.install}
        className="w-full sm:w-auto"
      >
        {banner.manualSteps ? 'Ver cómo' : 'Instalar'}
      </Button>

      <InstallStepsDialog open={stepsOpen} appName={app.name} onClose={() => setStepsOpen(false)} />
    </aside>
  );
}
