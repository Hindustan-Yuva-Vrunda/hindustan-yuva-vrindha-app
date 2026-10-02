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
  const [devoteeName, setDevoteeName] =
    useState("");

  const [phone, setPhone] = useState("");

  const [poojaName, setPoojaName] =
    useState("Ganapati Pooja");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            /*
             * IMPORTANT:
             * This is the selected calendar date.
             */
            date,

            devoteeName:
              devoteeName.trim(),

            phone: phone.trim(),

            poojaName,

            amount: 0,

            notes: notes.trim(),
          }),
        }
      );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        setError(
          data?.message ||
            "Unable to create booking."
        );

        return;
      }

      /*
       * Booking created successfully.
       *
       * Parent calendar will refresh itself.
       */
      onSuccess();
    } catch (error) {
      console.error(
        "Create booking error:",
        error
      );

      setError(
        "Something went wrong while creating the booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="relative max-h-[92vh] w-full max-w-lg overflow-hidden rounded-[28px] bg-[#FFFDF7] shadow-2xl">

        {/* Top accent */}

        <div className="h-1.5 w-full bg-gradient-to-r from-[#F59E0B] via-[#EA580C] to-[#F59E0B]" />

        {/* Header */}

        <div className="border-b border-[#F0E5D2] bg-gradient-to-br from-[#FFF8E7] to-[#FFFDF7] px-6 pb-5 pt-6">

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0C2] shadow-sm">

                <MdTempleHindu
                  size={30}
                  className="text-[#D97706]"
                />

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97706]">
                  Ganesh Seva
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#3B2415]">
                  Book Your Pooja
                </h2>

                <p className="mt-1 text-sm text-[#78716C]">
                  Seek the blessings of Lord
                  Ganesha
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#78716C] transition hover:bg-[#F5EFE4] hover:text-[#3B2415] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdClose size={22} />
            </button>

          </div>

          {/* Selected date */}

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#F3DFC0] bg-white/80 px-4 py-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3C4]">

              <MdEventAvailable
                size={20}
                className="text-[#EA580C]"
              />

            </div>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A8A29E]">
                Pooja Date
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#3B2415]">
                {formatDisplayDate(date)}
              </p>

              <p className="mt-0.5 text-xs text-[#A8A29E]">
                {date}
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(92vh-220px)] overflow-y-auto px-6 py-6"
        >

          <div className="space-y-5">

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
                  setDevoteeName(
                    event.target.value
                  )
                }
                required
                autoComplete="name"
                placeholder="Enter devotee name"
                className="w-full rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3.5 text-sm text-[#3B2415] outline-none transition placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100"
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
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                required
                autoComplete="tel"
                placeholder="Enter phone number"
                className="w-full rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3.5 text-sm text-[#3B2415] outline-none transition placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100"
              />

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
                  setPoojaName(
                    event.target.value
                  )
                }
                required
                className="w-full rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3.5 text-sm font-medium text-[#3B2415] outline-none transition focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100"
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
                  setNotes(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Any special request or information..."
                className="w-full resize-none rounded-2xl border border-[#DDD6CE] bg-white px-4 py-3.5 text-sm text-[#3B2415] outline-none transition placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100"
              />

            </div>

            {/* Error */}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Devotional message */}

            <div className="rounded-2xl border border-[#F3DFC0] bg-[#FFF8E7] px-4 py-3.5 text-center">

              <p className="text-sm font-semibold text-[#92400E]">
                🙏 May Lord Ganesha bless you
                and your family
              </p>

              <p className="mt-1 text-xs text-[#A16207]">
                With devotion, faith and शुभ
                आरंभ
              </p>

            </div>

          </div>

          {/* Actions */}

          <div className="mt-6 flex gap-3 border-t border-[#F0E5D2] pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl border border-[#D6D3D1] bg-white px-4 py-3.5 text-sm font-bold text-[#57534E] transition hover:bg-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-[#EA580C] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C2410C] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Booking..."
                : "Confirm Pooja Booking"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}