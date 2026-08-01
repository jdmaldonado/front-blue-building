import { z } from 'zod';

export const AppMode = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;
export type AppMode = (typeof AppMode)[keyof typeof AppMode];

// Shape of the raw environment. Keys are the VITE_* names; nothing outside this
// file knows them. Vite inlines `import.meta.env` at build time, so a missing
// variable is a build/deploy mistake and must fail loudly at startup.
const REQUIRED_URL = 'requerida, debe ser una URL http(s) con esquema (ej: http://localhost:3000)';

// `protocol` is not optional here: bare `z.url()` accepts 'localhost:3000',
// because the URL parser reads it as protocol 'localhost:' + path '3000'.
const httpUrl = z.url({ protocol: /^https?$/, error: REQUIRED_URL });

const EnvSchema = z.object({
  VITE_API_BASE_URL: httpUrl,
  // socket.io handshakes over HTTP and upgrades to WebSocket by itself, so this
  // is an http(s) URL, not ws(s). It points at the same origin as the API.
  VITE_SOCKET_URL: httpUrl,
  MODE: z.enum(AppMode).catch(AppMode.Production),
});

export interface AppConfig {
  readonly api: { readonly baseUrl: string };
  readonly socket: { readonly url: string };
  readonly mode: AppMode;
  readonly isDev: boolean;
}

export class AppConfigError extends Error {
  constructor(readonly issues: string[]) {
    super(`Configuración inválida:\n${issues.join('\n')}`);
    this.name = 'AppConfigError';
  }
}

// Pure: takes the raw source and returns the config. Testable without touching
// `import.meta`.
export function loadAppConfig(source: unknown): AppConfig {
  const parsed = EnvSchema.safeParse(source);

  if (!parsed.success) {
    throw new AppConfigError(parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
  }

  const env = parsed.data;

  return Object.freeze({
    api: Object.freeze({ baseUrl: env.VITE_API_BASE_URL }),
    socket: Object.freeze({ url: env.VITE_SOCKET_URL }),
    mode: env.MODE,
    isDev: env.MODE === AppMode.Development,
  });
}

let current: AppConfig | null = null;

// Called once from the bootstrap, before anything else runs.
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
