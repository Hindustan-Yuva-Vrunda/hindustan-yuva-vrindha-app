"use client";

import { FormEvent, useState } from "react";
import {
  MdClose,
  MdEventAvailable,
  MdPerson,
  MdPhone,
  MdNotes,
  MdTempleHindu,
} from "react-icons/md";

type Props = {
  date: string;
  onClose: () => void;
  onSuccess: () => void;
};

function formatDisplayDate(date: string) {
  const [year, month, day] = date.split("-");

  const dateObject = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return dateObject.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PoojaBookingModal({
  date,
  onClose,
  onSuccess,
}: Props) {
  const [devoteeName, setDevoteeName] = useState("");
  const [phone, setPhone] = useState("");
  const [poojaName, setPoojaName] = useState("Ganapati Pooja");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedName = devoteeName.trim();
    const trimmedPhone = phone.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedName) {
      setError("Devotee name is required.");
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (!poojaName.trim()) {
      setError("Please select a pooja.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          devoteeName: trimmedName,
          phone: trimmedPhone,
          poojaName: poojaName.trim(),
          amount: 0,
          notes: trimmedNotes,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.message || "Unable to create booking."
        );
        return;
      }

      onSuccess();
    } catch (error) {
      console.error("Create booking error:", error);

      setError(
        "Something went wrong while creating the booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-[#FFFDF7] shadow-2xl sm:max-h-[92dvh] sm:rounded-[28px]">
        {/* Top accent */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#F59E0B] via-[#EA580C] to-[#F59E0B]" />

        {/* Header */}
        <div className="shrink-0 border-b border-[#F0E5D2] bg-gradient-to-br from-[#FFF8E7] to-[#FFFDF7] px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0C2] shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
                <MdTempleHindu
                  size={26}
                  className="text-[#D97706] sm:h-[30px] sm:w-[30px]"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D97706] sm:text-xs sm:tracking-[0.18em]">
                  Ganesh Seva
                </p>

                <h2 className="mt-0.5 text-xl font-bold text-[#3B2415] sm:mt-1 sm:text-2xl">
                  Book Your Pooja
                </h2>

                <p className="mt-0.5 text-xs text-[#78716C] sm:mt-1 sm:text-sm">
                  Seek the blessings of Lord Ganesha
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#78716C] transition hover:bg-[#F5EFE4] hover:text-[#3B2415] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9"
            >
              <MdClose size={21} />
            </button>
          </div>

          {/* Selected date */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#F3DFC0] bg-white/80 px-3 py-2.5 sm:mt-5 sm:px-4 sm:py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF3C4] sm:h-9 sm:w-9">
              <MdEventAvailable
                size={19}
                className="text-[#EA580C]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A8A29E]">
                Pooja Date
              </p>

              <p className="mt-0.5 truncate text-xs font-bold text-[#3B2415] sm:text-sm">
                {formatDisplayDate(date)}
              </p>

              <p className="mt-0.5 text-[10px] text-[#A8A29E] sm:text-xs">
                {date}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Devotee Name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3B2415]">
                  <MdPerson
                    size={18}
                    className="text-[#EA580C]"
                  />
                  Devotee Name
                </label>

                <input
                  type="text"
                  value={devoteeName}
                  onChange={(event) =>
                    setDevoteeName(event.target.value)
                  }
                  required
                  autoComplete="name"
                  placeholder="Enter devotee name"
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3 text-sm text-[#3B2415] outline-none transition placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-[#F5F5F4] sm:py-3.5"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3B2415]">
                  <MdPhone
                    size={18}
                    className="text-[#EA580C]"
                  />
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => {
                    const numericValue =
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setPhone(numericValue);

                    if (error) {
                      setError("");
                    }
                  }}
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  autoComplete="tel"
                  placeholder="Enter 10-digit phone number"
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3 text-sm text-[#3B2415] outline-none transition placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-[#F5F5F4] sm:py-3.5"
                />

                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-xs text-[#A8A29E]">
                    Enter exactly 10 digits
                  </p>

                  <p
                    className={`text-xs font-semibold ${
                      phone.length === 10
                        ? "text-green-600"
                        : "text-[#A8A29E]"
                    }`}
                  >
                    {phone.length}/10
                  </p>
                </div>
              </div>

              {/* Pooja */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3B2415]">
                  <MdEventAvailable
                    size={18}
                    className="text-[#EA580C]"
                  />
                  Select Pooja
                </label>

                <select
                  value={poojaName}
                  onChange={(event) =>
                    setPoojaName(event.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3 text-sm font-medium text-[#3B2415] outline-none transition focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-[#F5F5F4] sm:py-3.5"
                >
                  <option value="Ganapati Pooja">
                    Ganapati Pooja
                  </option>

                  <option value="Sankashti Pooja">
                    Sankashti Pooja
                  </option>

                  <option value="Special Pooja">
                    Special Pooja
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3B2415]">
                  <MdNotes
                    size={18}
                    className="text-[#EA580C]"
                  />
                  Notes

                  <span className="font-normal text-[#A8A29E]">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={3}
                  disabled={loading}
                  placeholder="Any special request or information..."
                  className="w-full resize-none rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3 text-sm text-[#3B2415] outline-none transition placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-[#F5F5F4] sm:py-3.5"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Devotional message */}
              <div className="rounded-2xl border border-[#F3DFC0] bg-[#FFF8E7] px-4 py-3 text-center sm:py-3.5">
                <p className="text-xs font-semibold text-[#92400E] sm:text-sm">
                  🙏 May Lord Ganesha bless you and your family
                </p>

                <p className="mt-1 text-[11px] text-[#A16207] sm:text-xs">
                  With devotion, faith and शुभ आरंभ
                </p>
              </div>
            </div>
          </div>

          {/* Fixed bottom actions */}
          <div className="shrink-0 border-t border-[#F0E5D2] bg-[#FFFDF7] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-2xl border border-[#D6D3D1] bg-white px-3 py-3 text-sm font-bold text-[#57534E] transition hover:bg-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3.5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-[#EA580C] px-3 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#C2410C] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3.5"
              >
                {loading ? "Booking..." : "Confirm Pooja"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}