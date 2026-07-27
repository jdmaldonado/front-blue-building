import { ServicesProvider } from '@bb/logic';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { queryClient } from './app/queryClient';
import { router } from './app/router';
import { createServices } from './app/services';
import './styles/app.css';

const services = createServices();

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ServicesProvider value={services}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ServicesProvider>
  </StrictMode>,
);
