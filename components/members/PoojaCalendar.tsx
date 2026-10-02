"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  MdCalendarMonth,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdEventAvailable,
  MdLock,
  MdToday,
} from "react-icons/md";

import PoojaBookingModal from "./PoojaBookingModal";

type ApiBookingDay = {
  id?: string;
  date: string;
  status: "BOOKED" | "MY_BOOKING";
};

type BookingDay = {
  date: string;
  day: number;
  status: "FREE" | "BOOKED";
};

type Props = {
  year: number;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function getTodayString() {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(
    2,
    "0"
  )}`;
}

export default function PoojaCalendar({ year }: Props) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [month, setMonth] = useState(
    year === currentYear ? currentMonth : 0
  );

  const [days, setDays] = useState<ApiBookingDay[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<
    string | null
  >(null);

  const [showBooking, setShowBooking] = useState(false);

  /*
   * Reset month whenever selected year changes.
   */
  useEffect(() => {
    if (year === currentYear) {
      setMonth(currentMonth);
    } else {
      setMonth(0);
    }
  }, [year, currentYear, currentMonth]);

  /*
   * Load booked dates.
   *
   * IMPORTANT:
   * The API should NOT return CANCELLED bookings.
   *
   * Therefore:
   *
   * CONFIRMED  -> BOOKED
   * PENDING    -> BOOKED
   * COMPLETED  -> BOOKED
   * CANCELLED  -> FREE
   */
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/bookings/calendar?year=${year}&month=${
          month + 1
        }`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ??
            "Failed to load booking calendar."
        );
      }

      setDays(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Pooja calendar loading error:",
        error
      );

      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  /*
   * Load calendar whenever year/month changes.
   */
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  /*
   * Store booked dates in a Set.
   *
   * Both:
   * BOOKED
   * MY_BOOKING
   *
   * are treated as BOOKED.
   */
  const bookedDates = useMemo(() => {
    return new Set(
      days.map((item) => item.date)
    );
  }, [days]);

  /*
   * Build complete month calendar.
   */
  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const totalDays = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const result: (
      | BookingDay
      | null
    )[] = [];

    /*
     * Empty cells before first day.
     */
    for (
      let index = 0;
      index < firstDay;
      index++
    ) {
      result.push(null);
    }

    /*
     * Actual days.
     */
    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {
      const date = `${year}-${String(
        month + 1
      ).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;

      result.push({
        date,
        day,
        status: bookedDates.has(date)
          ? "BOOKED"
          : "FREE",
      });
    }

    return result;
  }, [year, month, bookedDates]);

  const bookedCount = calendarDays.filter(
    (day) => day?.status === "BOOKED"
  ).length;

  const freeCount = calendarDays.filter(
    (day) => day?.status === "FREE"
  ).length;

  const todayString = getTodayString();

  /*
   * Previous month.
   */
  const handlePreviousMonth = () => {
    setMonth((current) =>
      Math.max(0, current - 1)
    );
  };

  /*
   * Next month.
   */
  const handleNextMonth = () => {
    setMonth((current) =>
      Math.min(11, current + 1)
    );
  };

  /*
   * Only FREE dates can be selected.
   */
  const handleDateClick = (day: BookingDay) => {
    if (day.status === "BOOKED") {
      return;
    }

    setSelectedDate(day.date);
    setShowBooking(true);
  };

  /*
   * Close booking modal.
   */
  const handleCloseBooking = () => {
    setShowBooking(false);
    setSelectedDate(null);
  };

  /*
   * Refresh calendar after successful booking.
   */
  const handleBookingSuccess = async () => {
    setShowBooking(false);
    setSelectedDate(null);

    /*
     * Reload the calendar.
     *
     * Newly booked date becomes BOOKED.
     */
    await loadBookings();
  };

  return (
    <>
      <section className="overflow-hidden rounded-[28px] border border-[#F3E3B5] bg-white shadow-[0_25px_70px_rgba(59,36,21,0.10)]">

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E7] to-[#FFF1C2] px-4 py-5 sm:px-6 sm:py-6">

          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#FBBF24]/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#F97316]/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Title */}

            <div>
              <div className="mb-2 flex items-center gap-2">

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#EA580C] shadow-sm">
                  <MdCalendarMonth className="text-2xl" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A3412]">
                  Pooja Availability
                </span>

              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#3B2415] sm:text-3xl">
                {monthNames[month]}{" "}
                <span className="text-[#EA580C]">
                  {year}
                </span>
              </h2>

              <p className="mt-1 text-sm text-[#78583D]">
                Select a green date to create a
                new Pooja booking.
              </p>
            </div>

            {/* Month navigation */}

            <div className="flex items-center gap-2 self-start sm:self-center">

              <button
                type="button"
                onClick={handlePreviousMonth}
                disabled={month === 0}
                aria-label="Previous month"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8D6A5] bg-white text-[#7C4A21] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F59E0B] hover:bg-[#FFF8E7] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MdChevronLeft className="text-2xl" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={month === 11}
                aria-label="Next month"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8D6A5] bg-white text-[#7C4A21] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F59E0B] hover:bg-[#FFF8E7] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MdChevronRight className="text-2xl" />
              </button>

            </div>

          </div>

          {/* =====================================================
              STATUS SUMMARY
          ===================================================== */}

          <div className="relative mt-5 grid grid-cols-2 gap-3">

            {/* Free */}

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <MdCheckCircle className="text-xl" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Free
                </p>

                <p className="text-lg font-black text-emerald-800">
                  {freeCount}
                </p>
              </div>

            </div>

            {/* Booked */}

            <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white/80 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <MdEventAvailable className="text-xl" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  Booked
                </p>

                <p className="text-lg font-black text-orange-800">
                  {bookedCount}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* =========================================================
            CALENDAR
        ========================================================= */}

        <div className="p-3 sm:p-6">

          {/* Legend */}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-4">

              {/* Free legend */}

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />

                <span className="text-xs font-semibold text-gray-600">
                  Free
                </span>
              </div>

              {/* Booked legend */}

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F97316] shadow-[0_0_10px_rgba(245,158,11,0.45)]" />

                <span className="text-xs font-semibold text-gray-600">
                  Booked
                </span>
              </div>

            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MdToday className="text-[#2563EB]" />
              <span>Today</span>
            </div>

          </div>

          {/* Week names */}

          <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">

            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[10px] font-black uppercase tracking-wider text-[#8B7355] sm:text-xs"
              >
                {day}
              </div>
            ))}

          </div>

          {/* Calendar grid */}

          {loading ? (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

              {Array.from({ length: 35 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="aspect-square animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
                  />
                )
              )}

            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

              {calendarDays.map(
                (day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square rounded-2xl"
                      />
                    );
                  }

                  const isBooked =
                    day.status === "BOOKED";

                  const isToday =
                    day.date === todayString;

                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={isBooked}
                      onClick={() =>
                        handleDateClick(day)
                      }
                      title={
                        isBooked
                          ? `${formatDate(
                              day.date
                            )} — Already booked`
                          : `${formatDate(
                              day.date
                            )} — Available for booking`
                      }
                      aria-label={
                        isBooked
                          ? `${formatDate(
                              day.date
                            )} booked`
                          : `${formatDate(
                              day.date
                            )} free`
                      }
                      className={[
                        "group relative aspect-square overflow-hidden rounded-2xl border p-1.5 transition-all duration-200 sm:p-2.5",

                        isBooked
                          ? "cursor-not-allowed border-orange-300 bg-gradient-to-br from-[#FFF8D8] via-[#FDE68A] to-[#FDBA74] text-[#9A3412] shadow-[0_8px_24px_rgba(245,158,11,0.18)]"
                          : "cursor-pointer border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 text-emerald-800 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-[0_12px_28px_rgba(16,185,129,0.20)]",

                        isToday
                          ? "ring-2 ring-[#2563EB] ring-offset-2"
                          : "",
                      ].join(" ")}
                    >

                      {/* Decorative glow */}

                      <span
                        className={[
                          "pointer-events-none absolute -right-3 -top-3 h-10 w-10 rounded-full blur-xl transition-opacity",

                          isBooked
                            ? "bg-orange-300/60"
                            : "bg-emerald-300/50 opacity-0 group-hover:opacity-100",
                        ].join(" ")}
                      />

                      {/* Day number */}

                      <div className="relative flex h-full flex-col items-center justify-center">

                        <span
                          className={[
                            "text-base font-black sm:text-lg",

                            isBooked
                              ? "text-[#9A3412]"
                              : "text-emerald-800",
                          ].join(" ")}
                        >
                          {day.day}
                        </span>

                        {/* Status icon */}

                        <div className="mt-1">

                          {isBooked ? (
                            <MdEventAvailable className="text-base text-[#EA580C] sm:text-lg" />
                          ) : (
                            <MdCheckCircle className="text-base text-emerald-500 sm:text-lg" />
                          )}

                        </div>

                        {/* Status text */}

                        <span
                          className={[
                            "mt-0.5 hidden text-[8px] font-black uppercase tracking-wide sm:block",

                            isBooked
                              ? "text-[#C2410C]"
                              : "text-emerald-600",
                          ].join(" ")}
                        >
                          {isBooked
                            ? "Booked"
                            : "Free"}
                        </span>

                      </div>

                      {/* Today label */}

                      {isToday && (
                        <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full bg-[#2563EB] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wide text-white shadow-sm">
                          Today
                        </span>
                      )}

                      {/* Booked lock */}

                      {isBooked && (
                        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/70 text-orange-600 shadow-sm">
                          <MdLock className="text-[11px]" />
                        </span>
                      )}

                    </button>
                  );
                }
              )}

            </div>
          )}

          {/* Bottom information */}

          <div className="mt-5 rounded-2xl border border-[#F3E8C8] bg-[#FFFDF5] px-4 py-3">

            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF3C4] text-[#EA580C]">
                <MdCalendarMonth />
              </div>

              <div>

                <p className="text-xs font-bold text-[#3B2415]">
                  Booking availability
                </p>

                <p className="mt-0.5 text-xs leading-5 text-[#78583D]">
                  Green dates are available for
                  booking. Golden dates are already
                  booked and cannot be selected.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          BOOKING MODAL
      ========================================================= */}

      {showBooking && selectedDate && (
        <PoojaBookingModal
          date={selectedDate}
          onClose={handleCloseBooking}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}