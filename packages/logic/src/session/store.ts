import { LoginMode, type Session, type Space } from '@bb/core';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getSessionStorage } from './storage';

export interface SessionState {
  session: Session | null;
  // Only meaningful for a resident session; a super admin has no spaces.
  selectedSpaceIndex: number;
  setSession: (session: Session) => void;
  selectSpace: (index: number) => void;
  clearSession: () => void;
}

// The key is versioned: if the Session shape changes, old data is dropped
// instead of loading a session the app can no longer read.
const STORAGE_KEY = 'bb.session.v1';

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      selectedSpaceIndex: 0,
      setSession: (session) => set({ session, selectedSpaceIndex: 0 }),
      selectSpace: (index) => set({ selectedSpaceIndex: index }),
      clearSession: () => set({ session: null, selectedSpaceIndex: 0 }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(getSessionStorage),
      // Only data is stored, never the actions.
      partialize: (state) => ({ session: state.session, selectedSpaceIndex: state.selectedSpaceIndex }),
    },
  ),
);

export function selectIsAuthenticated(state: SessionState): boolean {
  return state.session !== null;
}

export function selectToken(state: SessionState): string | null {
  return state.session?.token ?? null;
}

export function selectIsSuperAdmin(state: SessionState): boolean {
  return state.session?.mode === LoginMode.Admin;
}

// Same reference every time: a selector that builds a new array on each call
// makes the store think the state changed and re-renders forever.
const NO_SPACES: Space[] = [];

export function selectSpaces(state: SessionState): Space[] {
  const { session } = state;
  return session !== null && session.mode === LoginMode.Usuario ? session.spaces : NO_SPACES;
}

export function selectCurrentSpace(state: SessionState): Space | null {
  return selectSpaces(state)[state.selectedSpaceIndex] ?? null;
}
