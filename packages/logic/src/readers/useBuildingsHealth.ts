import { ReaderHealth, readerHealthFromState, type DoorStatuses } from '@bb/core';
import { useQueryClient } from '@tanstack/react-query';
import { accessKeys } from '../access/keys';

// Worst first: one reader in alert decides how the whole building reads.
const SEVERITY: readonly ReaderHealth[] = [
  ReaderHealth.Alert,
  ReaderHealth.Offline,
  ReaderHealth.Warning,
  ReaderHealth.Busy,
  ReaderHealth.Online,
];

// Telemetry only arrives for buildings this session is subscribed to, and there
// is no endpoint to read it cold. So this answers from what is already cached:
// a building nobody has opened yet stays unknown, and that is the honest answer.
export function useBuildingsHealth(): (buildingId: string) => ReaderHealth {
  const queryClient = useQueryClient();

  return (buildingId: string) => {
    const statuses = queryClient.getQueryData<DoorStatuses>(accessKeys.doorStatuses(buildingId));
    if (statuses === undefined) {
      return ReaderHealth.Unknown;
    }

    const healths = Object.values(statuses).map((event) =>
      readerHealthFromState(event.masterStatus ?? event.eventType),
    );
    return SEVERITY.find((level) => healths.includes(level)) ?? ReaderHealth.Unknown;
  };
}
