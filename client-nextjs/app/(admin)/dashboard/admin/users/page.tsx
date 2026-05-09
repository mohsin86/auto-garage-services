// File: app/dashboard/users/page.tsx

"use client";

import {  useState } from "react";
import { useQuery,useMutation, useQueryClient, } from "@tanstack/react-query";

import UserForm from "./UserForm";
import { columns } from "./columns";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getUsers = async () => {
  try {
    const res = await fetch("/api/user");

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json();
  } catch (error) {
    console.error(error);

    throw error;
  }
};

  async function deleteUser(id: string) {
    const res = await fetch(`/api/user/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    return res.json();
  }

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<any>(null);

  const usersQuery = useQuery({
          queryKey: ["usersList"],
          queryFn: getUsers,
        });
        
  const deleteMutation = useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersList"],});
    },
  });
  
  const table = useReactTable({
    data: usersQuery.data?.data || [],
    columns: columns(setEditingUser, deleteMutation.mutate),
    getCoreRowModel: getCoreRowModel(),
  });

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (usersQuery.error instanceof Error) {
    return <div>{usersQuery.error.message}</div>;
  }

return (
  <div className="space-y-6">
    {/* FORM */}
    <UserForm
      editingUser={editingUser}
      onSuccess={() => {
        setEditingUser(null);
        queryClient.invalidateQueries({ queryKey: ["usersList"], });
      }}
    />

    {/* TABLE */}
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);
}