"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard,
  MdEventAvailable,
  MdPayments,
  MdLogout,
} from "react-icons/md";

const navItems = [
  {
    name: "Dashboard",
    href: "/member",
    icon: MdDashboard,
  },
  {
    name: "Pooja Bookings",
    href: "/member/pooja-bookings",
    icon: MdEventAvailable,
  },
  {
    name: "Collections",
    href: "/member/collections",
    icon: MdPayments,
  },
];

export default function UserNavbar() {
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

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /*
   * Active navigation item
   *
   * Dashboard should only be active on exactly /member.
   * Other items can also match their child routes.
   */
  function isNavItemActive(href: string) {
    if (href === "/member") {
      return pathname === "/member";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-orange-100 bg-[#FFF7E6] lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-orange-100 px-6">
          <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#FBBF24] bg-white shadow-sm">
            <img
              src="/images/Hyv_logo.jpg"
              alt="Hindustan Yuva Vrindha"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-[#3B2415]">
              Hindustan Yuva
            </p>

            <p className="text-xs font-medium text-[#EA580C]">
              Member Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#EA580C] text-white shadow-md shadow-orange-200"
                    : "text-[#3B2415] hover:bg-orange-100 hover:text-[#EA580C]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#FBBF24]" />
                )}

                <Icon
                  className={`text-xl transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-[#EA580C] group-hover:text-[#EA580C]"
                  }`}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-orange-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#3B2415] transition hover:bg-red-50 hover:text-red-600"
          >
            <MdLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE TOP NAVIGATION
      ========================================================= */}
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-[#FFF7E6]/95 shadow-sm backdrop-blur lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/member"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#FBBF24] bg-white">
              <img
                src="/images/Hyv_logo.jpg"
                alt="Hindustan Yuva Vrindha"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#3B2415]">
                Hindustan Yuva
              </p>

              <p className="text-xs text-[#EA580C]">
                Member Panel
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="shrink-0 rounded-lg p-2 text-[#EA580C] transition hover:bg-orange-100 active:scale-95"
          >
            <MdLogout className="text-2xl" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#EA580C] text-white shadow-md shadow-orange-200"
                    : "border border-orange-100 bg-white text-[#3B2415] hover:bg-orange-50"
                }`}
              >
                <Icon
                  className={`text-base ${
                    isActive
                      ? "text-white"
                      : "text-[#EA580C]"
                  }`}
                />

                <span>{item.name}</span>

                {/* Mobile active indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#FBBF24]" />
                )}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
