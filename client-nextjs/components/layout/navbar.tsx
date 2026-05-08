"use client";

import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuthStore } from "@/lib/store/auth.store";

export default function Navbar() {
  const router = useRouter();

  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-lg">Dashboard</h2>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}