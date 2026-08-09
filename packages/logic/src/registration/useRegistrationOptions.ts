import type { Apartment, Building, Floor, Tower } from '@bb/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { registrationKeys } from './registration.keys';

// The four steps of the picker, each one waiting for the one above it. They
// read the public endpoints, because this runs with no session.
export function useRegistrationBuildings(): UseQueryResult<Building[]> {
  const { registrationGateway } = useServices();

  return useQuery({
    queryKey: registrationKeys.buildings(),
    queryFn: () => registrationGateway.listBuildings(),
  });
}

export function useRegistrationTowers(buildingId: string | null): UseQueryResult<Tower[]> {
  const { registrationGateway } = useServices();

  return useQuery({
    queryKey: registrationKeys.towers(buildingId),
    queryFn: () => {
      if (buildingId === null) {
        throw new Error('buildingId is required');
      }
      return registrationGateway.listTowers(buildingId);
    },
    enabled: buildingId !== null,
  });
}

export function useRegistrationFloors(towerId: string | null): UseQueryResult<Floor[]> {
  const { registrationGateway } = useServices();

  return useQuery({
    queryKey: registrationKeys.floors(towerId),
    queryFn: () => {
      if (towerId === null) {
        throw new Error('towerId is required');
      }
      return registrationGateway.listFloors(towerId);
    },
    enabled: towerId !== null,
  });
}

export function useRegistrationApartments(floorId: string | null, active: boolean): UseQueryResult<Apartment[]> {
  const { registrationGateway } = useServices();

  return useQuery({
    queryKey: registrationKeys.apartments(floorId, active),
    queryFn: () => {
      if (floorId === null) {
        throw new Error('floorId is required');
      }
      return registrationGateway.listApartments({ floorId, active });
    },
    enabled: floorId !== null,
  });
}
