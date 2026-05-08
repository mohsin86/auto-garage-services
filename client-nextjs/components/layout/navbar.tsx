"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuthStore } from "@/lib/store/auth.store";

const logoutUser = async () => {
  const res = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};

export default function Navbar() {
  const router = useRouter();

 // const logout = useAuthStore((s) => s.logout);

  const logoutMutation = useMutation({
  mutationFn: logoutUser,

  onSuccess: () => {
    localStorage.removeItem("token");

    router.push("/");
  },
});

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
  <DropdownMenuItem>
    Profile
  </DropdownMenuItem>

  <DropdownMenuItem
    disabled={logoutMutation.isPending}
    onSelect={() => logoutMutation.mutate()}
  >
    {logoutMutation.isPending
      ? "Logging out..."
      : "Logout"}
  </DropdownMenuItem>
</DropdownMenuContent>
        
        
        
      </DropdownMenu>
    </header>
  );
}