import { z } from 'zod';

export const AppMode = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;
export type AppMode = (typeof AppMode)[keyof typeof AppMode];

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
