import { ArrowLeft, ArrowRight } from "lucide-react";
import { DOTS, usePagination } from "~/hooks/use-pagination";

type PaginationPropsType = {
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (pageNumber: number) => void;
};
export function Pagination({
  onPageChange,
  totalCount,
  currentPage,
  pageSize,
  siblingCount = 1,
}: PaginationPropsType) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage =
    paginationRange && paginationRange[paginationRange.length - 1];

  return (
    <ul>
      <button disabled={currentPage === 1} onClick={onPrevious}>
        <ArrowLeft />
      </button>
      {paginationRange &&
        paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <button key={index}>&#8230;</button>;
          }

          return (
            <button
              key={index}
              onClick={() => onPageChange(Number(pageNumber))}
            >
              {pageNumber}
            </button>
          );
        })}
      <button disabled={currentPage === lastPage} onClick={onNext}>
        <ArrowRight />
      </button>
    </ul>
  );
}
