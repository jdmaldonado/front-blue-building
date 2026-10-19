import { useState, useSyncExternalStore } from 'react';
import { getInstallState, isAppleMobile, isRunningInstalled, openInstallPrompt, subscribeInstallState } from '../lib';

const DISMISSED_AT_KEY = 'bb.install-banner.dismissed-at';
const DAY_MS = 24 * 60 * 60 * 1000;
// Closed by mistake or not, it comes back after this long.
const HIDDEN_FOR_MS = 7 * DAY_MS;

export type InstallBannerController = {
  visible: boolean;
  // On iPhone there is no install button: the banner shows the steps instead.
  manualSteps: boolean;
  install: () => void;
  dismiss: () => void;
};

// Storage can throw (private mode, blocked site data). Then the banner simply
// shows again next time.
function readDismissedAt(): number {
  try {
    return Number(localStorage.getItem(DISMISSED_AT_KEY) ?? 0);
  } catch {
    return 0;
  }
}

function saveDismissedAt(time: number): void {
  try {
    localStorage.setItem(DISMISSED_AT_KEY, String(time));
  } catch {
    // Nothing to do: it is only a reminder.
  }
}

export function useInstallBanner(): InstallBannerController {
  const install = useSyncExternalStore(subscribeInstallState, getInstallState);
  const [dismissedAt, setDismissedAt] = useState(readDismissedAt);
  const manualSteps = isAppleMobile();

  const recentlyDismissed = Date.now() - dismissedAt < HIDDEN_FOR_MS;
  const canInstall = install.prompt !== null || manualSteps;

  return {
    visible: canInstall && !install.installed && !recentlyDismissed && !isRunningInstalled(),
    manualSteps,
    install: () => void openInstallPrompt(),
    dismiss: () => {
      const now = Date.now();
      saveDismissedAt(now);
      setDismissedAt(now);
    },
  };
}
