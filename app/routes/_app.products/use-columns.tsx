import { type Product } from "@prisma/client";
import { Link } from "@remix-run/react";
import { type ColumnDef } from "@tanstack/react-table";
import { FileEditIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";

export type ProductColumn = Pick<
  Product,
  "id" | "imageUrl" | "name" | "price" | "categoryId"
>;

export function useColumns() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const columns = useMemo<ColumnDef<ProductColumn>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => {
          const product = info.row.original;
          return (
            <Link
              to={`/products/${product.id}`}
              className="hover:text-blue-500 duration-150"
            >
              {info.getValue() as string}
            </Link>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        //@ts-ignore
        cell: (info) => info.row.original.category.name,
        enableSorting: false,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (info) => {
          return (
            <div className="space-x-2">
              <Button
                type="button"
                className="rounded-md p-2 bg-blue-500"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <FileEditIcon />
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-md p-2"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2Icon />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  return {
    columns,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  };
}
