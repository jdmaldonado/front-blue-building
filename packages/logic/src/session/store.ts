import type { LoginResponse, Space, User } from '@bb/core';
import { create } from 'zustand';

export interface SessionState {
  token: string | null;
  user: User | null;
  spaces: Space[];
  selectedSpaceIndex: number;
  isAuthenticated: boolean;
  setSession: (session: LoginResponse) => void;
  selectSpace: (index: number) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  token: null,
  user: null,
  spaces: [],
  selectedSpaceIndex: 0,
  isAuthenticated: false,
  setSession: (session) =>
    set({
      token: session.token,
      user: session.user,
      spaces: session.spaces,
      selectedSpaceIndex: 0,
      isAuthenticated: true,
    }),
  selectSpace: (index) => set({ selectedSpaceIndex: index }),
  clearSession: () =>
    set({
      token: null,
      user: null,
      spaces: [],
      selectedSpaceIndex: 0,
      isAuthenticated: false,
    }),
}));

export function selectCurrentSpace(state: SessionState): Space | null {
  return state.spaces[state.selectedSpaceIndex] ?? null;
}
