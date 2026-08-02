import type { Building } from '@bb/core';
import { selectSpaces, useSessionStore } from '@bb/logic';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

// The building these screens work on. A resident gets it from their space; an
// admin gets it from the route. Screens below always read it from here.
const BuildingContext = createContext<Building | null>(null);

export function useBuilding(): Building {
  const building = useContext(BuildingContext);
  if (building === null) {
    throw new Error('useBuilding must be used within a BuildingProvider');
  }
  return building;
}

export function useOptionalBuilding(): Building | null {
  return useContext(BuildingContext);
}

type BuildingProviderProps = {
  building: Building;
  children: ReactNode;
};

export function BuildingProvider({ building, children }: BuildingProviderProps) {
  return <BuildingContext.Provider value={building}>{children}</BuildingContext.Provider>;
}

// Resident case: the building of the selected space.
export function useSessionBuilding(): Building | null {
  const spaces = useSessionStore(selectSpaces);
  const selectedIndex = useSessionStore((state) => state.selectedSpaceIndex);

  return useMemo(() => spaces[selectedIndex]?.building ?? null, [spaces, selectedIndex]);
}
