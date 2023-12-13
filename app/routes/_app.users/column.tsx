import { type ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female";
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => new Date(info.getValue() as Date).toDateString(),
  },
];
