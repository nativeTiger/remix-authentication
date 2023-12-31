import { useSearchParams } from "@remix-run/react";
import { DOTS, usePagination } from "~/hooks/use-pagination";
import {
  PaginationContent,
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "~/components/ui/pagination";

type PaginationPropsType = {
  totalCount: number;
  siblingCount?: number;
  pageSize: number;
};

export function CustomPagination({
  totalCount,
  pageSize,
  siblingCount = 1,
}: PaginationPropsType) {
  const pageParam = "page";
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // const totalPages = Math.ceil(totalCount / pageSize);

  const previousQuery = new URLSearchParams(queryParams);
  previousQuery.set(pageParam, String(currentPage - 1));

  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, String(currentPage + 1));

  const pageChange = new URLSearchParams(queryParams);

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const lastPage =
    paginationRange && paginationRange[paginationRange.length - 1];

  const isPreviousButtonDisabled = currentPage === 1;
  const isNextButtonDisabled = currentPage >= Number(lastPage);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={`?${previousQuery.toString()}`}
            aria-disabled={isPreviousButtonDisabled}
            className={isPreviousButtonDisabled ? "pointer-events-none" : ""}
            tabIndex={isPreviousButtonDisabled ? -1 : undefined}
          />
        </PaginationItem>
        {paginationRange &&
          paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            pageChange.set(pageParam, String(pageNumber));
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  key={index}
                  to={`?${pageChange.toString()}`}
                  isActive={currentPage === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        <PaginationItem>
          <PaginationNext
            to={`?${nextQuery.toString()}`}
            aria-disabled={isNextButtonDisabled}
            className={isNextButtonDisabled ? "pointer-events-none" : ""}
            tabIndex={isNextButtonDisabled ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
