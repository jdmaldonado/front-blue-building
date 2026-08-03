import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'bb.sidebar.collapsed.v1';
const COLLAPSED_VALUE = 'true';

// Reading storage can throw in private mode, so a failure just means "expanded".
function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === COLLAPSED_VALUE;
  } catch {
    return false;
  }
}

export interface SidebarCollapsedState {
  collapsed: boolean;
  toggle: () => void;
}

export function useSidebarCollapsed(): SidebarCollapsedState {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // The choice is not worth breaking the screen for.
    }
  }, [collapsed]);

  const toggle = useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  return { collapsed, toggle };
}
