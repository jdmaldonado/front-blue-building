import { z } from 'zod';

export const AppMode = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;
export type AppMode = (typeof AppMode)[keyof typeof AppMode];

// The same code ships as two apps, each on its own URL so a phone installs them
// apart. Each deploy says which one it is.
export const AppKind = {
  Resident: 'resident',
  Admin: 'admin',
} as const;
export type AppKind = (typeof AppKind)[keyof typeof AppKind];

export type AppIdentity = { name: string; shortName: string; icons: string };

// What a phone shows for each app once installed. Read by the build too.
export const APP_IDENTITY: Record<AppKind, AppIdentity> = {
  [AppKind.Resident]: { name: 'Blue Building', shortName: 'BlueBuilding', icons: '/icons/resident' },
  [AppKind.Admin]: { name: 'Blue Building Admin', shortName: 'BB Admin', icons: '/icons/admin' },
};

// Optional, so a deploy that predates the split stays the resident app. An
// empty value counts as not set.
const AppKindSchema = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.enum(AppKind).default(AppKind.Resident),
);

// Also called by vite.config.ts, so a wrong value fails the build instead of
// publishing an app that cannot start.
export function readAppKind(source: Record<string, string | undefined>): AppKind {
  const parsed = AppKindSchema.safeParse(source.VITE_APP_KIND);
  if (!parsed.success) {
    throw new Error(`VITE_APP_KIND inválida: "${source.VITE_APP_KIND}". Usa resident o admin.`);
  }
  return parsed.data;
}

const REQUIRED_URL = 'requerida, debe ser una URL http(s) con esquema (ej: http://localhost:3000)';

// `protocol` is needed: plain `z.url()` accepts 'localhost:3000', because it
// reads 'localhost:' as the protocol.
const httpUrl = z.url({ protocol: /^https?$/, error: REQUIRED_URL });

// The VITE_* names live only in this file. A missing one is a deploy mistake,
// so we fail at startup.
const EnvSchema = z.object({
  VITE_API_BASE_URL: httpUrl,
  // socket.io starts over HTTP and upgrades on its own, so this is http(s),
  // not ws(s).
  VITE_SOCKET_URL: httpUrl,
  VITE_APP_KIND: AppKindSchema,
  MODE: z.enum(AppMode).catch(AppMode.Production),
});

export interface AppConfig {
  readonly api: { readonly baseUrl: string };
  readonly socket: { readonly url: string };
  readonly kind: AppKind;
  readonly mode: AppMode;
  readonly isDev: boolean;
}

export class AppConfigError extends Error {
  constructor(readonly issues: string[]) {
    super(`Configuración inválida:\n${issues.join('\n')}`);
    this.name = 'AppConfigError';
  }
}

// Pure, so it can be tested without `import.meta`.
export function loadAppConfig(source: unknown): AppConfig {
  const parsed = EnvSchema.safeParse(source);

  if (!parsed.success) {
    throw new AppConfigError(parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
  }

  const env = parsed.data;

  return Object.freeze({
    api: Object.freeze({ baseUrl: env.VITE_API_BASE_URL }),
    socket: Object.freeze({ url: env.VITE_SOCKET_URL }),
    kind: env.VITE_APP_KIND,
    mode: env.MODE,
    isDev: env.MODE === AppMode.Development,
  });
}

let current: AppConfig | null = null;

// Called once at startup.
export function initAppConfig(source: unknown = import.meta.env): AppConfig {
  current = loadAppConfig(source);
  return current;
}

export function getAppConfig(): AppConfig {
  if (current === null) {
    throw new Error('getAppConfig called before initAppConfig');
  }
  return current;
}
