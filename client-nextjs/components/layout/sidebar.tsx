"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

const sidebarByRole = {
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Vehicles",
      href: "/dashboard/vehicles",
      icon: Car,
    },
    {
      title: "Services",
      href: "/dashboard/services",
      icon: Wrench,
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: Receipt,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],

  mechanic: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Assigned Services",
      href: "/dashboard/mechanic/services",
      icon: Wrench,
    },
    {
      title: "Vehicles",
      href: "/dashboard/vehicles",
      icon: Car,
    },
  ],

  customer: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Vehicles",
      href: "/dashboard/my-vehicles",
      icon: Car,
    },
    {
      title: "Bookings",
      href: "/dashboard/my-bookings",
      icon: CalendarCheck,
    },
    {
      title: "Invoices",
      href: "/dashboard/my-invoices",
      icon: Receipt,
    },
  ],
};

// ======================================================
// SIDEBAR COMPONENT
// ======================================================

export default function Sidebar() {
  const pathname = usePathname();

  // ======================================================
  // GET USER
  // ======================================================

  let user: any = null;

  if (typeof window !== "undefined") {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  }

  const role = user?.role || "customer";

  // ROLE MENUS
  const menus =
    sidebarByRole[
      role as keyof typeof sidebarByRole
    ] || [];

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
            <Link
              key={menu.href}
              href={menu.href}
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
            </Link>
          );
        })}
      </nav>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <div className="border-t p-4">
        <button
          className="
            flex w-full items-center gap-3 rounded-xl
            px-4 py-3 text-sm font-medium text-red-500
            transition hover:bg-red-50
          "
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}