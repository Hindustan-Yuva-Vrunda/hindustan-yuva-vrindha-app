"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard,
  MdLogout,
  MdPeople,
  MdTempleHindu,
} from "react-icons/md";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: MdDashboard,
  },
  {
    name: "Users",
    href: "/admin#users",
    icon: MdPeople,
  },
  {
    name: "Ganesha",
    href: "/admin#ganesha",
    icon: MdTempleHindu,
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed.");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-50
          hidden
          w-56
          border-r
          border-orange-100
          bg-white
          lg:block
          xl:w-64
        "
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-orange-100 px-4 xl:px-6">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#FBBF24] xl:h-11 xl:w-11">
            <img
              src="/images/Hyv_logo.jpg"
              alt="HYV"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[#3B2415]">
              HYV Admin
            </p>

            <p className="truncate text-xs text-[#8B7B6B]">
              Management Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-3 xl:p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : false;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition xl:px-4 ${
                  active
                    ? "bg-orange-50 text-[#EA580C]"
                    : "text-[#6B5B4D] hover:bg-orange-50 hover:text-[#EA580C]"
                }`}
              >
                <Icon size={21} className="shrink-0" />

                <span className="truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-orange-100 p-3 xl:p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
              xl:px-4
            "
          >
            <MdLogout size={21} className="shrink-0" />

            <span className="truncate">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE / TABLET NAVBAR ================= */}
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-orange-100
          bg-white
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
          lg:hidden
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            max-w-md
            items-stretch
            justify-around
            px-2
            sm:h-[68px]
            sm:px-4
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : false;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-xl
                  px-1
                  text-[10px]
                  font-semibold
                  transition
                  sm:text-xs
                  ${
                    active
                      ? "text-[#EA580C]"
                      : "text-[#6B5B4D]"
                  }
                `}
              >
                <Icon
                  size={22}
                  className="shrink-0 sm:size-6"
                />

                <span className="truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              min-w-0
              flex-1
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              px-1
              text-[10px]
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
              sm:text-xs
            "
          >
            <MdLogout
              size={22}
              className="shrink-0 sm:size-6"
            />

            <span className="truncate">
              Logout
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}