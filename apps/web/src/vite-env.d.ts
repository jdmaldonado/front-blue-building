/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SOCKET_URL?: string;
  readonly VITE_APP_KIND?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Chrome and Edge only, so the DOM types do not have it yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
}
