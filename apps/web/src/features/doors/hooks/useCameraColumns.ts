import { useEffect, useState } from 'react';

export const CameraColumns = { One: '1', Two: '2', Three: '3' } as const;
export type CameraColumns = (typeof CameraColumns)[keyof typeof CameraColumns];

const STORAGE_KEY = 'bb.doors.cameraColumns.v1';
const DEFAULT_COLUMNS: CameraColumns = CameraColumns.Two;

function isCameraColumns(value: string | null): value is CameraColumns {
  return value === CameraColumns.One || value === CameraColumns.Two || value === CameraColumns.Three;
}

// Reading storage can throw in private mode, so a failure just means the default.
function readColumns(): CameraColumns {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isCameraColumns(stored) ? stored : DEFAULT_COLUMNS;
  } catch {
    return DEFAULT_COLUMNS;
  }
}

export interface CameraColumnsState {
  columns: CameraColumns;
  setColumns: (columns: CameraColumns) => void;
}

// Kept between visits: nobody wants to choose the layout every time they open a
// door.
export function useCameraColumns(): CameraColumnsState {
  const [columns, setColumns] = useState(readColumns);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, columns);
    } catch {
      // The choice is not worth breaking the screen for.
    }
  }, [columns]);

  return { columns, setColumns };
}
