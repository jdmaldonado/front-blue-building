import { useSyncExternalStore } from 'react';

export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

// Same key as the script in index.html, which applies it before the first paint.
const STORAGE_KEY = 'bb.theme';
// The color the phone paints around the app, from the base surface of each theme.
const BAR_COLOR: Record<Theme, string> = {
  [Theme.Light]: '#E9F1F7',
  [Theme.Dark]: '#030A11',
};

const listeners = new Set<() => void>();
const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === Theme.Light || value === Theme.Dark ? value : null;
  } catch {
    return null;
  }
}

// Until someone picks one, the app follows the system.
function currentTheme(): Theme {
  return readStored() ?? (systemDark().matches ? Theme.Dark : Theme.Light);
}

function paintBars(theme: Theme): void {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', BAR_COLOR[theme]);
  });
}

function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Then it lasts until the page reloads.
  }
  document.documentElement.dataset.theme = theme;
  paintBars(theme);
  listeners.forEach((listener) => listener());
}

// Called at startup: the script in index.html sets the theme, not the bar color.
export function paintThemeBars(): void {
  const stored = readStored();
  if (stored !== null) {
    paintBars(stored);
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  systemDark().addEventListener('change', listener);
  return () => {
    listeners.delete(listener);
    systemDark().removeEventListener('change', listener);
  };
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, currentTheme);
  return {
    theme,
    toggle: () => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark),
  };
}
