import { useEffect } from 'react';
import { hideSplash, showSplash } from './splash';

const SHOW_DELAY_MS = 300;

// Shows the splash while a page loads. Only after a short wait, so a fast page
// never flashes it. It renders nothing itself.
export function PageSplash(): null {
  useEffect(() => {
    let shown = false;
    const timer = window.setTimeout(() => {
      shown = true;
      showSplash();
    }, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      if (shown) {
        hideSplash();
      }
    };
  }, []);

  return null;
}
