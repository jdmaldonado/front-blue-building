import { useState } from 'react';

export interface ServerPagination {
  page: number;
  limit: number;
  // Zero based, which is what the Pagination primitive speaks.
  pageIndex: number;
  goTo: (pageIndex: number) => void;
  reset: () => void;
}

// These endpoints page on the server, so `DataTable` cannot do it: it only knows
// how to page what it already has. The state lives here and the view wires it to
// the `Pagination` primitive.
export function useServerPagination(limit: number): ServerPagination {
  const [page, setPage] = useState(1);

  return {
    page,
    limit,
    pageIndex: page - 1,
    goTo: (pageIndex) => setPage(pageIndex + 1),
    reset: () => setPage(1),
  };
}
