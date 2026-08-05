import { ServicesProvider } from '@bb/logic';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { LucideProvider } from 'lucide-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigErrorScreen } from './app/ConfigErrorScreen';
import { queryClient } from './app/queryClient';
import { router } from './app/router';
import { createServices } from './app/services';
import { initAppConfig } from './config';
import './styles/app.css';

const ICON_STROKE_WIDTH = 1.5;

// Startup order: config first (it validates the environment and throws if
// something required is missing), then the services that depend on it.
function bootstrap(): void {
  const rootElement = document.getElementById('root');
  if (rootElement === null) {
    throw new Error('Root element #root not found');
  }

  const root = createRoot(rootElement);

  try {
    initAppConfig();
  } catch (error) {
    root.render(<ConfigErrorScreen error={error} />);
    return;
  }

  const services = createServices();

  root.render(
    <StrictMode>
      <ServicesProvider value={services}>
        <QueryClientProvider client={queryClient}>
          {/* Thinner than the lucide default of 2: it reads as an instrument
              rather than as a generic app icon. Set once, for every icon. */}
          <LucideProvider strokeWidth={ICON_STROKE_WIDTH}>
            <RouterProvider router={router} />
          </LucideProvider>
        </QueryClientProvider>
      </ServicesProvider>
    </StrictMode>,
  );
}

bootstrap();
