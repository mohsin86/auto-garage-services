// File: app/dashboard/users/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

export const columns = (
  setEditingUser: any,
  deleteUser: any
): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "mobile",
    header: "Mobile",
  },

  {
    accessorKey: "role",
    header: "Role",
  },

  {
    header: "Actions",

    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() =>
            setEditingUser(row.original)
          }
        >
          Edit
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() =>
            deleteUser(row.original.id)
          }
        >
          Delete
        </Button>
      </div>
    ),
  },
];