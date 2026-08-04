import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../cn';
import { IconButton } from '../icon-button';
import { paginationStatusVariants, paginationVariants, type PaginationVariants } from './Pagination-variants';

type PaginationProps = PaginationVariants & {
  // Zero based, like TanStack Table.
  pageIndex: number;
  pageCount: number;
  onPageChange: (pageIndex: number) => void;
  // Optional counter, for example "120 usuarios".
  total?: string;
  className?: string;
};

// Previous and next only. Numbered pages need a stable total, which most of our
// lists do not have.
export function Pagination({ pageIndex, pageCount, onPageChange, total, padding, className }: PaginationProps) {
  const safePageCount = Math.max(pageCount, 1);
  const isFirst = pageIndex <= 0;
  const isLast = pageIndex >= safePageCount - 1;

  return (
    <div className={cn(paginationVariants({ padding }), className)}>
      <span className={paginationStatusVariants()}>{total}</span>

      <div className="flex items-center gap-2">
        <span className={paginationStatusVariants()}>
          Página <span className="font-mono">{pageIndex + 1}</span> de{' '}
          <span className="font-mono">{safePageCount}</span>
        </span>
        <IconButton label="Página anterior" disabled={isFirst} onClick={() => onPageChange(pageIndex - 1)}>
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton label="Página siguiente" disabled={isLast} onClick={() => onPageChange(pageIndex + 1)}>
          <ChevronRight size={18} />
        </IconButton>
      </div>
    </div>
  );
}
