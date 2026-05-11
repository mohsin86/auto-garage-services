"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Receipt,
  Users,
  Wrench,
  ClipboardList,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

// ======================================================
// ROLE-BASED SIDEBAR CONFIG
// ======================================================

type SubMenu = {
  title: string;
  href: string;
};

type MenuItem = {
  title: string;
  href: string;
  icon: any;
  children?: SubMenu[];
};

const sidebarByRole: Record<string, MenuItem[]> = {
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Vehicles",
      href: "/dashboard/admin/vehicles",
      icon: Car,
    },
    {
      title: "Services",
      href: "/dashboard/admin/services/list",
      icon: Wrench,
      children: [
            {
              title: "List Services",
              href: "/dashboard/admin/services",
            },
            {
              title: "Create Service",
              href: "/dashboard/admin/services/create",
            },
          ],
    },
    {
      title: "Invoices",
      href: "/dashboard/admin/invoices",
      icon: Receipt,
    },
    {
      title: "Reports",
      href: "/dashboard/Reports",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      href: "/dashboard/Settings",
      icon: Settings,
    },
  ],

  mechanic: [
    {
      title: "Dashboard",
      href: "/dashboard/mechanic",
      icon: LayoutDashboard,
    },
    {
      title: "Assigned Services",
      href: "/dashboard/mechanic/services",
      icon: Wrench,
    }
    
  ],

  customer: [
    {
      title: "Dashboard",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      title: "My Vehicles",
      href: "/dashboard/customer/my-vehicles",
      icon: Car,
    },
    {
      title: "Bookings",
      href: "/dashboard/customer/my-bookings",
      icon: CalendarCheck,
    },
    {
      title: "Invoices",
      href: "/dashboard/customer/my-invoices",
      icon: Receipt,
    },
  ],
};

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

// ======================================================
// SIDEBAR COMPONENT
// ======================================================

export default function Sidebar() {
  const router = useRouter();

  const pathname = usePathname();
    const logoutMutation = useMutation({
      mutationFn: logoutUser,

      onSuccess: () => {
        localStorage.removeItem("token");

        router.push("/");
      },
    });

  // ======================================================
  // GET USER
  // ======================================================

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);
 
  const role = user?.role ?? "user";

  // ROLE MENUS
  const menus = sidebarByRole[role as keyof typeof sidebarByRole] || [];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-white">
      {/* ====================================================== */}
      {/* LOGO */}
      {/* ====================================================== */}

      <div className="flex h-16 items-center gap-2 border-b px-6">
        <ShieldCheck className="h-6 w-6" />

        <div>
          <h1 className="text-lg font-bold">
            Auto Garage
          </h1>

          <p className="text-xs text-gray-500 capitalize">
            {role} panel
          </p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* USER INFO */}
      {/* ====================================================== */}

      <div className="border-b p-4">
        <p className="font-semibold text-sm">
          {user?.name || "Guest"}
        </p>

        <p className="text-xs text-gray-500">
          {user?.email || ""}
        </p>
      </div>

      {/* ====================================================== */}
      {/* MENU */}
      {/* ====================================================== */}

      <nav className="flex-1 space-y-1 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.href ||
            pathname.startsWith(menu.href + "/");

          return (
            <div key={menu.href}>
                <Link key={menu.href}  
                      href={menu.href}>
                  <div 
                    className={`
                    flex items-center gap-3 rounded-xl px-4 py-3
                    text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-black text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  >
                    <Icon size={18} />
                    <span>{menu.title}</span>
                  </div>
                </Link>

                {menu.children?.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="ml-10 block py-2 text-sm text-gray-600"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
          );
        })}
      </nav>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <div className="border-t p-4">
        <button
          onClick={() => logoutMutation.mutate()}

          className="
            flex w-full items-center gap-3 rounded-xl
            px-4 py-3 text-sm font-medium text-red-500
            transition hover:bg-red-50
          "
        >
          <LogOut size={18}   />

          <span  >Logout</span>
        </button>
      </div>
    </aside>
  );
}