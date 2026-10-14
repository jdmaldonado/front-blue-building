const SPLASH_MIN_MS = 600;

// When the splash last appeared. It starts at 0, the moment the page began loading.
let shownAt = 0;
let hideTimer: number | undefined;

// The splash lives in index.html so it shows before the app has downloaded.
function findSplash(): HTMLElement | null {
  const splash = document.getElementById('splash');
  // `splash-blocked` is set by index.html on browsers too old for the app.
  return splash === null || splash.classList.contains('splash-blocked') ? null : splash;
}

export function showSplash(): void {
  const splash = findSplash();
  if (splash === null) {
    return;
  }
  window.clearTimeout(hideTimer);
  shownAt = performance.now();
  splash.classList.remove('splash-hidden');
}

// It stays at least SPLASH_MIN_MS so a fast load does not look like a flicker.
export function hideSplash(): void {
  const splash = findSplash();
  if (splash === null) {
    return;
  }
  const wait = Math.max(0, shownAt + SPLASH_MIN_MS - performance.now());
  hideTimer = window.setTimeout(() => splash.classList.add('splash-hidden'), wait);
}
