import { LoginMode } from '@bb/core';
import { useSessionStore } from '@bb/logic';
import { useRouterState } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';
import { AppRoute } from './navigation';

// iOS body text at the default setting, and how far we follow it: past this
// the bars and the door dialog stop fitting on a phone.
const IOS_DEFAULT_BODY_PX = 17;
const MAX_TEXT_SCALE = 1.3;

// Safari ignores the iPhone text size unless asked through this keyword, and
// on a Mac the keyword means 13px, so it is read on iOS only (touch callout).
function iosTextScale(): number {
  if (!CSS.supports('font', '-apple-system-body') || !CSS.supports('-webkit-touch-callout', 'none')) {
    return 1;
  }
  const probe = document.createElement('span');
  probe.style.font = '-apple-system-body';
  document.body.append(probe);
  const size = Number.parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  if (!Number.isFinite(size)) {
    return 1;
  }
  return Math.min(Math.max(size / IOS_DEFAULT_BODY_PX, 1), MAX_TEXT_SCALE);
}

// The resident app reads bigger: a step more (see `largeTextStep`) and the
// iPhone text size. On <html>, because dialogs render outside the app tree.
export function useResidentTextSize(): void {
  const mode = useSessionStore((state) => state.session?.mode ?? null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // Without a session, the path says which app this is.
  const large = mode === null ? !pathname.startsWith(AppRoute.Admin) : mode === LoginMode.Usuario;

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = large ? 'large' : 'normal';

    const applyScale = () => {
      root.style.fontSize = large ? `${iosTextScale() * 100}%` : '';
    };
    applyScale();
    // The setting is changed in the iPhone settings, so read it again on return.
    document.addEventListener('visibilitychange', applyScale);
    return () => document.removeEventListener('visibilitychange', applyScale);
  }, [large]);
}
