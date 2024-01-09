import { useNavigation, useSearchParams } from "@remix-run/react";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import {
  Table as TableShadcn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TableRowSkeleton } from "./skeleton";
import { useTable } from "~/hooks/useTable";
import { useEffect } from "react";

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
};

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  const { table, sorting } = useTable(columns, data);

  const [searchParams, setSearchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);

  const navigation = useNavigation();

  const isLoading = searchParams.size !== 0 && navigation.state === "loading";

  useEffect(() => {
    if (sorting.length > 0) {
      params.set("page", "1");
      params.set("sort", sorting[0].id);
      params.set("order", sorting[0].desc ? "desc" : "asc");
    } else {
      params.delete("sort");
      params.delete("order");
    }
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  return (
    <TableShadcn>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "flex items-center gap-x-2 cursor-pointer"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <span className="">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {header.column.getIsSorted() ? (
                        {
                          asc: <ChevronUpIcon />,
                          desc: <ChevronDownIcon />,
                        }[(header.column.getIsSorted() as string) ?? null]
                      ) : (
                        <>
                          {header.column.getCanSort() ? (
                            <ChevronsUpDownIcon />
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </div>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      {isLoading ? (
        <>
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </>
      ) : (
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-1.5 px-4 ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns && columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
    </TableShadcn>
  );
}
