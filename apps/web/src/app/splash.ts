const SPLASH_MIN_MS = 600;

// The splash lives in index.html so it shows before the app has downloaded.
// It stays at least SPLASH_MIN_MS so a fast load does not look like a flicker.
export function hideSplash(): void {
  const splash = document.getElementById('splash');
  if (splash === null) {
    return;
  }

  const wait = Math.max(0, SPLASH_MIN_MS - performance.now());
  window.setTimeout(() => splash.classList.add('splash-hidden'), wait);
}
