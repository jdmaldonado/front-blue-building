import { LoginMode, type Session, type Space } from '@bb/core';
import { create } from 'zustand';

export interface SessionState {
  session: Session | null;
  // Only meaningful for a resident session; a super admin has no spaces.
  selectedSpaceIndex: number;
  setSession: (session: Session) => void;
  selectSpace: (index: number) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  session: null,
  selectedSpaceIndex: 0,
  setSession: (session) => set({ session, selectedSpaceIndex: 0 }),
  selectSpace: (index) => set({ selectedSpaceIndex: index }),
  clearSession: () => set({ session: null, selectedSpaceIndex: 0 }),
}));

export function selectIsAuthenticated(state: SessionState): boolean {
  return state.session !== null;
}

export function selectToken(state: SessionState): string | null {
  return state.session?.token ?? null;
}

export function selectIsSuperAdmin(state: SessionState): boolean {
  return state.session?.mode === LoginMode.Admin;
}

export function selectSpaces(state: SessionState): Space[] {
  const { session } = state;
  return session !== null && session.mode === LoginMode.Usuario ? session.spaces : [];
}

export function selectCurrentSpace(state: SessionState): Space | null {
  return selectSpaces(state)[state.selectedSpaceIndex] ?? null;
}
