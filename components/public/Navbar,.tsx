"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  Info,
  Images,
  Phone,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: Images,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Phone,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "bg-[#FFFDF5]/95 shadow-md backdrop-blur-md"
            : "bg-[#FFFDF5]/90 backdrop-blur-sm"
        }
      `}
    >
      {/* Top festive line */}
      <div className="h-1 bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#2563EB]" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* ================= LOGO ================= */}

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-3"
        >
          {/* HYV Logo */}
          <div
            className="
              relative flex h-12 w-12
              items-center justify-center
              overflow-hidden rounded-full
              border-2 border-[#FBBF24]
              bg-white
              shadow-md
              transition-all duration-300
              group-hover:scale-105
              group-hover:shadow-lg
            "
          >
            <img
              src="/images/Hyv_logo.jpg"
              alt="Hindustan Yuva Vrindha Logo"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Brand */}
          <div className="hidden sm:block">
            <p
              className="
                text-sm font-bold
                tracking-[0.2em]
                text-[#EA580C]
              "
            >
              HINDUSTAN
            </p>

            <p
              className="
                text-xs font-semibold
                tracking-[0.25em]
                text-[#1E3A8A]
              "
            >
              YUVA VRINDHA
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group relative
                  flex items-center gap-2
                  py-2
                  text-sm font-semibold
                  text-[#292524]
                  transition-colors duration-300
                  hover:text-[#EA580C]
                "
              >
                <Icon
                  size={16}
                  className="
                    text-[#2563EB]
                    transition-transform duration-300
                    group-hover:-translate-y-0.5
                  "
                />

                {item.label}

                {/* Hover underline */}
                <span
                  className="
                    absolute
                    -bottom-1
                    left-0
                    h-0.5
                    w-0
                    rounded-full
                    bg-gradient-to-r
                    from-[#F97316]
                    to-[#FBBF24]
                    transition-all duration-300
                    group-hover:w-full
                  "
                />
              </Link>
            );
          })}

          {/* ================= LOGIN ================= */}

          <Link
            href="/login"
            className="
              flex items-center gap-2
              rounded-full
              border-2 border-[#2563EB]
              px-5 py-2.5
              text-sm font-semibold
              text-[#2563EB]
              transition-all duration-300
              hover:bg-[#2563EB]
              hover:text-white
              hover:shadow-md
            "
          >
            <LogIn size={16} />
            Login
          </Link>

          {/* ================= REGISTER ================= */}

          <Link
            href="/register"
            className="
              flex items-center gap-2
              rounded-full
              bg-gradient-to-r
              from-[#F97316]
              to-[#FBBF24]
              px-5 py-2.5
              text-sm font-bold
              text-white
              shadow-md
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            <UserPlus size={16} />
            Register
          </Link>
        </nav>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="
            rounded-lg
            border border-[#F97316]/30
            bg-white
            p-2.5
            text-[#EA580C]
            shadow-sm
            transition-all duration-300
            hover:bg-[#FFF7ED]
            lg:hidden
          "
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={27} /> : <Menu size={27} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`
          overflow-hidden
          border-t border-[#FBBF24]/30
          bg-[#FFFDF5]
          transition-all duration-300
          lg:hidden
          ${
            mobileOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <nav className="flex flex-col gap-2 px-5 py-5">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="
                  group
                  flex items-center gap-3
                  rounded-xl
                  border border-transparent
                  px-4 py-3.5
                  font-medium
                  text-[#292524]
                  transition-all duration-300
                  hover:border-[#FBBF24]/40
                  hover:bg-[#FFF7ED]
                  hover:text-[#EA580C]
                "
              >
                <Icon
                  size={18}
                  className="
                    text-[#2563EB]
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />

                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div
            className="
              my-2 h-px
              bg-gradient-to-r
              from-transparent
              via-[#FBBF24]/50
              to-transparent
            "
          />

          {/* ================= MOBILE LOGIN ================= */}

          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="
              flex items-center justify-center gap-2
              rounded-full
              border-2 border-[#2563EB]
              px-5 py-3
              font-semibold
              text-[#2563EB]
              transition-all duration-300
              hover:bg-[#2563EB]
              hover:text-white
            "
          >
            <LogIn size={17} />
            Login
          </Link>

          {/* ================= MOBILE REGISTER ================= */}

          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="
              flex items-center justify-center gap-2
              rounded-full
              bg-gradient-to-r
              from-[#F97316]
              to-[#FBBF24]
              px-5 py-3
              font-bold
              text-white
              shadow-md
              transition-all duration-300
              hover:shadow-lg
            "
          >
            <UserPlus size={17} />
            Register
          </Link>
        </nav>
      </div>

      {/* Bottom subtle line */}
      <div
        className="
          h-[2px]
          bg-gradient-to-r
          from-[#F97316]/20
          via-[#FBBF24]/60
          to-[#2563EB]/20
        "
      />
    </header>
  );
}