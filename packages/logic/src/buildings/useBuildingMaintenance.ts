import type { Building, MaintenanceInput } from '@bb/core';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useServices } from '../services/context';
import { buildingKeys } from './keys';

export interface BuildingMaintenance {
  enable: UseMutationResult<Building, Error, MaintenanceInput>;
  disable: UseMutationResult<Building, Error, string>;
}

// Both write into the same list the whole admin panel reads, so the badge
// updates everywhere at once.
export function useBuildingMaintenance(): BuildingMaintenance {
  const { buildingsGateway } = useServices();
  const queryClient = useQueryClient();

  const invalidate = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: buildingKeys.list() });
  };

  const enable = useMutation({
    mutationFn: (input: MaintenanceInput) => buildingsGateway.enableMaintenance(input),
    onSuccess: invalidate,
  });

  const disable = useMutation({
    mutationFn: (buildingId: string) => buildingsGateway.disableMaintenance(buildingId),
    onSuccess: invalidate,
  });

  return { enable, disable };
}
