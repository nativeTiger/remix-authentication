import { useNavigation } from "@remix-run/react";
import { type ColumnDef, type Table, flexRender } from "@tanstack/react-table";
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

type DataTableProps<T> = {
  table: Table<T>;
  columns?: ColumnDef<T>[];
};

export function DataTable<T>({ table, columns }: DataTableProps<T>) {
  const navigation = useNavigation();
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
      {navigation.state === "loading" ? (
        <>
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
