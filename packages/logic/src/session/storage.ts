import type { StateStorage } from 'zustand/middleware';

// Falls back to memory when there is no localStorage (tests, React Native).
// The native app will replace this with its own adapter.
function createMemoryStorage(): StateStorage {
  const data = new Map<string, string>();
  return {
    getItem: (name) => data.get(name) ?? null,
    setItem: (name, value) => {
      data.set(name, value);
    },
    removeItem: (name) => {
      data.delete(name);
    },
  };
}

export function getSessionStorage(): StateStorage {
  if (typeof globalThis.localStorage === 'undefined') {
    return createMemoryStorage();
  }
  return globalThis.localStorage;
}
