"use client";

import GaneshaManagement from "./GaneshaManagement";
import UserManagement from "./UserManagement";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFFDF5] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-8 sm:space-y-10">
        
        {/* Dashboard Header */}
        <section className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#EA580C] sm:text-sm sm:tracking-[0.2em]">
            Admin Panel
          </p>

          <h1
            className="
              mt-1
              text-2xl
              font-bold
              leading-tight
              bg-gradient-to-r
              from-[#A16207]
              via-[#FBBF24]
              to-[#D97706]
              bg-clip-text
              text-transparent
              drop-shadow-[0_2px_6px_rgba(251,191,36,0.25)]
              sm:text-3xl
              md:text-4xl
            "
          >
            Hindustan Yuva Vrindha
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-[#78716C] sm:text-sm">
            Manage users and yearly Ganesha records.
          </p>
        </section>

        {/* Users */}
        <section id="users" className="w-full min-w-0">
          <UserManagement />
        </section>

        {/* Ganesha */}
        <section id="ganesha" className="w-full min-w-0">
          <GaneshaManagement />
        </section>

      </div>
    </div>
  );
}