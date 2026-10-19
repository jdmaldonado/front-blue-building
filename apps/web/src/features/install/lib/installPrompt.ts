// Chrome and Edge fire `beforeinstallprompt` once, early, when the app can be
// installed. It is kept here so a button can open the install dialog later.
type InstallPromptEvent = Event & { prompt: () => Promise<void> };

type InstallState = {
  prompt: InstallPromptEvent | null;
  installed: boolean;
};

let state: InstallState = { prompt: null, installed: false };
const listeners = new Set<() => void>();

function setState(next: InstallState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

// Called at startup, before any screen: the event may come before React does.
export function listenForInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Without this Chrome shows its own bar too, next to ours.
    event.preventDefault();
    setState({ ...state, prompt: event as InstallPromptEvent });
  });
  window.addEventListener('appinstalled', () => setState({ prompt: null, installed: true }));
}

export function subscribeInstallState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getInstallState(): InstallState {
  return state;
}

// The browser asks the person, and the event can be used only once.
export async function openInstallPrompt(): Promise<void> {
  const { prompt } = state;
  if (prompt === null) {
    return;
  }
  setState({ ...state, prompt: null });
  await prompt.prompt();
}

// Opened from the home screen icon, so already installed.
export function isRunningInstalled(): boolean {
  const iosStandalone = 'standalone' in navigator && navigator.standalone === true;
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches;
}

// iPhone and iPad never fire the event: there the steps are by hand. iPadOS
// says it is a Mac, so touch tells them apart.
export function isAppleMobile(): boolean {
  const { userAgent, maxTouchPoints } = navigator;
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
}
