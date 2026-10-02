
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  MdCalendarMonth,
  MdEventAvailable,
} from "react-icons/md";

import CurrentYearSummary from "./CurrentYearSummary";
import PoojaCalendar from "./PoojaCalendar";

export default function UserDashboard() {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedYear(new Date().getFullYear());
    setLoading(false);
  }, []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 5 }, (_, index) => currentYear - index);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFDF5] px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FBBF24]/30 border-t-[#EA580C]" />

              <p className="mt-4 text-sm text-[#78716C]">
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF5] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            {/* Heading */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">
                Member Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#3B2415] sm:text-4xl">
                <span
                className="
                font-extrabold text-5xl
                  bg-gradient-to-r
                  from-[#A16207]
                  via-[#FBBF24]
                  to-[#D97706]
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_2px_6px_rgba(251,191,36,0.25)]
                "
              >
                Ganeshotsav {" "}
              </span>
                <span className="text-[#EA580C]">
                  {selectedYear}
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78716C] sm:text-base">
                Manage your Pooja bookings, view your collection
                and check upcoming booking availability.
              </p>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#FBBF24]/30 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF3C4]">
                <MdCalendarMonth
                  size={22}
                  className="text-[#EA580C]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#78716C]">
                  Select Year
                </p>

                <select
                  value={selectedYear}
                  onChange={(event) =>
                    setSelectedYear(Number(event.target.value))
                  }
                  className="mt-1 cursor-pointer border-none bg-transparent p-0 pr-8 text-sm font-bold text-[#3B2415] outline-none focus:ring-0"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Current Year Summary */}
        <CurrentYearSummary year={selectedYear} />

        {/* Calendar */}
        <section className="mt-8">
          <div className="mb-5">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF3C4]">
                <MdEventAvailable
                  size={24}
                  className="text-[#EA580C]"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#3B2415]">
                  Pooja Booking Calendar
                </h2>

                <p className="text-sm text-[#78716C]">
                  Select an open date to make a Pooja booking for{" "}
                  <span className="font-semibold text-[#EA580C]">
                    {selectedYear}
                  </span>
                  .
                </p>
              </div>

            </div>
          </div>

          <PoojaCalendar year={selectedYear} />
        </section>

      </div>
    </main>
  );
}
