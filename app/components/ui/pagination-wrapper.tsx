import { useSearchParams } from "@remix-run/react";
import { DOTS, usePagination } from "~/hooks/use-pagination";
import {
  PaginationContent,
  Pagination,
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

export function PaginationWrapper({
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
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationPrevious
          prefetch="intent"
          to={`?${previousQuery.toString()}`}
          aria-disabled={isPreviousButtonDisabled}
          className={isPreviousButtonDisabled ? "pointer-events-none" : ""}
          tabIndex={isPreviousButtonDisabled ? -1 : undefined}
        />
        {paginationRange &&
          paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return <PaginationEllipsis key={index} />;
            }
            pageChange.set(pageParam, String(pageNumber));
            return (
              <PaginationLink
                key={index}
                to={`?${pageChange.toString()}`}
                isActive={currentPage === pageNumber}
                prefetch="intent"
              >
                {pageNumber}
              </PaginationLink>
            );
          })}
        <PaginationNext
          prefetch="intent"
          to={`?${nextQuery.toString()}`}
          aria-disabled={isNextButtonDisabled}
          className={isNextButtonDisabled ? "pointer-events-none" : ""}
          tabIndex={isNextButtonDisabled ? -1 : undefined}
        />
      </PaginationContent>
    </Pagination>
  );
}
