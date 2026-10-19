import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { APP_IDENTITY, readAppKind } from './src/config/app.config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname);
  // The icons of each app are the PNGs exported from its public/icons/*/icon.svg.
  const app = APP_IDENTITY[readAppKind(env)];

  return {
    plugins: [
      // Must run before the React plugin: it generates src/routeTree.gen.ts from
      // the files in src/routes.
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
      tailwindcss(),
      // iOS takes the home screen name and icon from these tags, not the manifest.
      // The short name, because iOS cuts long ones and both apps would read the same.
      {
        name: 'app-identity',
        transformIndexHtml: (html: string) =>
          html
            .replaceAll('%APP_NAME%', app.name)
            .replaceAll('%APP_SHORT_NAME%', app.shortName)
            .replaceAll('%APP_ICONS%', app.icons),
      },
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          // Without an id, changing `start_url` later makes browsers treat this as
          // a different app. Both apps open at `/`, which sends to the right login.
          id: '/',
          name: app.name,
          short_name: app.shortName,
          description: 'Administración y monitoreo de edificios',
          lang: 'es',
          dir: 'ltr',
          // Brand colors, taken from the logo files of the current app. The
          // background matches the splash in index.html, so Android shows no jump.
          theme_color: '#00BCDC',
          background_color: '#258fb6',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: `${app.icons}/icon-192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${app.icons}/icon-512.png`, sizes: '512x512', type: 'image/png' },
            { src: `${app.icons}/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
      }),
    ],
  };
});
