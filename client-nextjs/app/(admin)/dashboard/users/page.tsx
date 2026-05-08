// File: app/dashboard/users/page.tsx

"use client";

import { useEffect, useState } from "react";

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

import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState<any>(null);

  async function loadUsers() {
    const res = await fetch(
      "api/users"
    );

    const data = await res.json();

    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function deleteUser(id: string) {
    await fetch(`api/users/${id}`, {
      method: "DELETE",
    });

    loadUsers();
  }

  const table = useReactTable({
    data: users,
    columns: columns(setEditingUser, deleteUser),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* FORM */}
      <UserForm
        editingUser={editingUser}
        onSuccess={() => {
          setEditingUser(null);
          loadUsers();
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
            {table.getRowModel().rows.map((row) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}