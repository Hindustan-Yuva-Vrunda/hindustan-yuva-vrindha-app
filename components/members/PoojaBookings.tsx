"use client";

import { useEffect, useState } from "react";

import {
  MdCalendarMonth,
  MdEventAvailable,
  MdPerson,
  MdPhone,
  MdClose,
  MdNotes,
  MdConfirmationNumber,
  MdEdit,
  MdDelete,
  MdSave,
} from "react-icons/md";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

type Booking = {
  id: string;
  bookingNumber: string;
  poojaName: string;
  amount: number;
  devoteeName: string;
  devoteePhone: string | null;
  devoteeAddress: string | null;
  year: number;
  bookingDate: string;
  bookingStatus: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: BookingStatus) {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-700";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function PoojaBooking() {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    devoteeName: "",
    devoteePhone: "",
    devoteeAddress: "",
    poojaName: "",
    amount: "",
    notes: "",
  });

  const years = Array.from(
    { length: currentYear - 2019 },
    (_, index) => currentYear - index
  );

  
const confirmedBookingCount = bookings.filter(
  (booking) => booking.bookingStatus === "CONFIRMED"
).length;
  // ----------------------------------------------------------
  // LOAD BOOKINGS
  // ----------------------------------------------------------

  const loadBookings = async (year: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/bookings?year=${year}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load bookings.");
        setBookings([]);
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Load bookings error:", error);

      setError(
        "Something went wrong while loading bookings."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // INITIAL LOAD / YEAR CHANGE
  // ----------------------------------------------------------

  useEffect(() => {
    loadBookings(selectedYear);
  }, [selectedYear]);

  // ----------------------------------------------------------
  // OPEN EDIT MODE
  // ----------------------------------------------------------

  const handleEditClick = () => {
    if (!selectedBooking) return;

    setEditForm({
      devoteeName: selectedBooking.devoteeName,
      devoteePhone: selectedBooking.devoteePhone || "",
      devoteeAddress: selectedBooking.devoteeAddress || "",
      poojaName: selectedBooking.poojaName,
      amount: String(selectedBooking.amount),
      notes: selectedBooking.notes || "",
    });

    setEditing(true);
  };

  // ----------------------------------------------------------
  // SAVE EDITED BOOKING
  // ----------------------------------------------------------

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;

    try {
      setSaving(true);

      const response = await fetch(
        `/api/bookings/${selectedBooking.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            devoteeName: editForm.devoteeName.trim(),
            phone: editForm.devoteePhone.trim(),
            devoteeAddress:
              editForm.devoteeAddress.trim(),
            poojaName: editForm.poojaName.trim(),
            amount: Number(editForm.amount || 0),
            notes: editForm.notes.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message || "Unable to update booking."
        );
        return;
      }

      const updatedBooking =
        data.booking as Booking;

      setBookings((current) =>
        current.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking
        )
      );

      setSelectedBooking(updatedBooking);

      setEditing(false);
    } catch (error) {
      console.error("Update booking error:", error);

      alert(
        "Something went wrong while updating the booking."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------------
  // DELETE BOOKING
  // ----------------------------------------------------------

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete booking ${selectedBooking.bookingNumber}?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/bookings/${selectedBooking.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message || "Unable to delete booking."
        );
        return;
      }

      setBookings((current) =>
        current.filter(
          (booking) =>
            booking.id !== selectedBooking.id
        )
      );

      setSelectedBooking(null);
      setEditing(false);
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(
        "Something went wrong while deleting the booking."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-5 sm:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-2">
            <MdEventAvailable
              size={26}
              className="text-[#EA580C]"
            />

            <h1 className="text-2xl font-bold text-[#3B2415]">
              Pooja Booking
            </h1>
          </div>

          <p className="mt-1 text-sm text-[#78716C]">
            View Pooja bookings for {selectedYear}.
          </p>
        </div>

        {/* ================================================== */}
        {/* SELECTED YEAR SUMMARY */}
        {/* ================================================== */}

        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <MdCalendarMonth
              size={20}
              className="text-[#EA580C]"
            />

            <h2 className="text-lg font-bold text-[#3B2415]">
              {selectedYear} Bookings
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* TOTAL BOOKINGS */}

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-[#78716C]">
                    Total Bookings
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#3B2415]">
                    {confirmedBookingCount}
                  </p>

                  <p className="mt-1 text-xs text-[#A8A29E]">
                    For {selectedYear}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3C4]">
                  <MdEventAvailable
                    size={24}
                    className="text-[#EA580C]"
                  />
                </div>

              </div>
            </div>

            {/* SELECTED YEAR */}

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-[#78716C]">
                    Selected Year
                  </p>

                  <select
                    value={selectedYear}
                    onChange={(event) =>
                      setSelectedYear(
                        Number(event.target.value)
                      )
                    }
                    className="mt-1 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-lg font-bold text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                  >
                    {years.map((year) => (
                      <option
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3C4]">
                  <MdCalendarMonth
                    size={24}
                    className="text-[#EA580C]"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        {/* ================================================== */}
        {/* EMPTY */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3C4]">
                <MdEventAvailable
                  size={32}
                  className="text-[#EA580C]"
                />
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#3B2415]">
                No Pooja Bookings
              </h2>

              <p className="mt-2 text-sm text-[#78716C]">
                There are no bookings recorded for{" "}
                {selectedYear}.
              </p>

            </div>
          )}

        {/* ================================================== */}
        {/* BOOKING LIST */}
        {/* ================================================== */}

        {!loading && bookings.length > 0 && (
          <div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#3B2415]">
                Booking List
              </h2>

              <span className="text-sm text-[#78716C]">
                {confirmedBookingCount}{" "}
                {confirmedBookingCount === 1
                  ? "booking"
                  : "bookings"}
              </span>
            </div>

            <div className="space-y-4">

              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() =>
                    setSelectedBooking(booking)
                  }
                  className="group w-full rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-4">

                      {/* DATE */}

                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#FFF3C4]">

                        <span className="text-xs font-semibold uppercase text-[#EA580C]">
                          {new Date(
                            booking.bookingDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                            }
                          )}
                        </span>

                        <span className="text-xl font-bold text-[#3B2415]">
                          {new Date(
                            booking.bookingDate
                          ).getDate()}
                        </span>

                      </div>

                      {/* BOOKING INFO */}

                      <div className="min-w-0">

                        <h3 className="truncate text-base font-bold text-[#3B2415]">
                          {booking.devoteeName}
                        </h3>

                        <p className="mt-1 text-sm text-[#78716C]">
                          {booking.poojaName}
                        </p>

                        <p className="mt-1 text-xs text-[#A8A29E]">
                          {formatDate(
                            booking.bookingDate
                          )}{" "}
                          • {booking.bookingNumber}
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="flex items-center sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                  </div>
                </button>
              ))}

            </div>
          </div>
        )}

      </div>

      {/* ================================================== */}
      {/* BOOKING DETAILS MODAL */}
      {/* ================================================== */}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-[#FFFDF5] shadow-2xl">

            {/* ================================================== */}
            {/* MODAL HEADER */}
            {/* ================================================== */}

            <div className="relative overflow-hidden bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FBBF24] px-6 py-7 sm:px-8">

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

              <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10" />

              <div className="relative">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <div className="mb-3 flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        {editing
                          ? "Edit Booking"
                          : "Booking Details"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                          selectedBooking.bookingStatus
                        )}`}
                      >
                        {selectedBooking.bookingStatus}
                      </span>

                    </div>

                    <h2 className="truncate text-2xl font-bold text-white sm:text-3xl">
                      {selectedBooking.devoteeName}
                    </h2>

                    <p className="mt-1 text-sm text-white/80">
                      {selectedBooking.poojaName}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black/10 px-3 py-2 backdrop-blur-sm">

                      <MdConfirmationNumber
                        size={17}
                        className="text-white"
                      />

                      <span className="text-xs font-semibold text-white">
                        {selectedBooking.bookingNumber}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBooking(null);
                      setEditing(false);
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
                  >
                    <MdClose size={23} />
                  </button>

                </div>

              </div>
            </div>

            {/* ================================================== */}
            {/* MODAL CONTENT */}
            {/* ================================================== */}

            <div className="max-h-[calc(92vh-180px)] overflow-y-auto p-5 sm:p-7">

              {/* ================================================== */}
              {/* EDIT FORM */}
              {/* ================================================== */}

              {editing ? (
                <div className="space-y-5">

                  {/* DEVOTEE NAME */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#3B2415]">
                      Devotee Name
                    </label>

                    <div className="relative">

                      <MdPerson
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EA580C]"
                      />

                      <input
                        value={editForm.devoteeName}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            devoteeName:
                              event.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-orange-200 bg-white py-3 pl-10 pr-4 text-sm text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                      />

                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#3B2415]">
                      Phone Number
                    </label>

                    <div className="relative">

                      <MdPhone
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EA580C]"
                      />

                      <input
                        value={editForm.devoteePhone}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            devoteePhone:
                              event.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-orange-200 bg-white py-3 pl-10 pr-4 text-sm text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                      />

                    </div>
                  </div>

                  {/* ADDRESS */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#3B2415]">
                      Address
                    </label>

                    <textarea
                      value={editForm.devoteeAddress}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          devoteeAddress:
                            event.target.value,
                        })
                      }
                      rows={3}
                      className="w-full resize-none rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* POOJA NAME */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#3B2415]">
                      Pooja Name
                    </label>

                    <input
                      value={editForm.poojaName}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          poojaName:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* AMOUNT */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#3B2415]">
                      Contribution Amount
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={editForm.amount}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          amount:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* NOTES */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#3B2415]">
                      Notes
                    </label>

                    <textarea
                      value={editForm.notes}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          notes: event.target.value,
                        })
                      }
                      rows={3}
                      className="w-full resize-none rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#3B2415] outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* EDIT ACTIONS */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MdClose size={20} />
                      Cancel Edit
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EA580C] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C2410C] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <MdSave size={20} />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </div>

                </div>
              ) : (
                <div className="space-y-5">

                  {/* ================================================== */}
                  {/* DEVOTEE INFORMATION */}
                  {/* ================================================== */}

                  <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3C4]">
                        <MdPerson
                          size={23}
                          className="text-[#EA580C]"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                          Devotee Information
                        </p>

                        <h3 className="mt-0.5 text-base font-bold text-[#3B2415]">
                          Personal Details
                        </h3>
                      </div>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="rounded-xl bg-[#FFFDF5] p-4">
                        <p className="text-xs text-[#A8A29E]">
                          Devotee Name
                        </p>

                        <p className="mt-1 font-semibold text-[#3B2415]">
                          {selectedBooking.devoteeName}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#FFFDF5] p-4">

                        <div className="flex items-center gap-2">

                          <MdPhone
                            size={16}
                            className="text-[#EA580C]"
                          />

                          <p className="text-xs text-[#A8A29E]">
                            Phone Number
                          </p>

                        </div>

                        <p className="mt-1 font-semibold text-[#3B2415]">
                          {selectedBooking.devoteePhone ||
                            "Not provided"}
                        </p>

                      </div>

                      {selectedBooking.devoteeAddress && (
                        <div className="rounded-xl bg-[#FFFDF5] p-4 sm:col-span-2">

                          <p className="text-xs text-[#A8A29E]">
                            Address
                          </p>

                          <p className="mt-1 text-sm font-medium leading-6 text-[#3B2415]">
                            {selectedBooking.devoteeAddress}
                          </p>

                        </div>
                      )}

                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* QUICK SUMMARY */}
                  {/* ================================================== */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3C4]">

                          <MdCalendarMonth
                            size={21}
                            className="text-[#EA580C]"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A8A29E]">
                            Date
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-[#3B2415]">
                            {formatDate(
                              selectedBooking.bookingDate
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                          <MdEventAvailable
                            size={21}
                            className="text-blue-600"
                          />

                        </div>

                        <div>

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A8A29E]">
                            Year
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-[#3B2415]">
                            {selectedBooking.year}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                          <span className="text-lg font-bold text-[#EA580C]">
                            ₹
                          </span>

                        </div>

                        <div>

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A8A29E]">
                            Contribution
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-[#EA580C]">
                            ₹
                            {Number(
                              selectedBooking.amount
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ================================================== */}
                  {/* POOJA INFORMATION */}
                  {/* ================================================== */}

                  <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF3C4]">

                        <MdEventAvailable
                          size={25}
                          className="text-[#EA580C]"
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                          Pooja
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-[#3B2415]">
                          {selectedBooking.poojaName}
                        </h3>

                        <p className="mt-1 text-sm text-[#78716C]">
                          Scheduled for{" "}
                          <span className="font-semibold text-[#57534E]">
                            {formatDate(
                              selectedBooking.bookingDate
                            )}
                          </span>
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ================================================== */}
                  {/* BOOKING INFORMATION */}
                  {/* ================================================== */}

                  <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">

                        <MdConfirmationNumber
                          size={23}
                          className="text-[#EA580C]"
                        />

                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                          Booking Information
                        </p>

                        <h3 className="mt-0.5 text-base font-bold text-[#3B2415]">
                          Booking Reference
                        </h3>

                      </div>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="rounded-xl bg-[#FFFDF5] p-4">

                        <p className="text-xs text-[#A8A29E]">
                          Booking Number
                        </p>

                        <p className="mt-1 break-all font-semibold text-[#3B2415]">
                          {selectedBooking.bookingNumber}
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#FFFDF5] p-4">

                        <p className="text-xs text-[#A8A29E]">
                          Booking Created
                        </p>

                        <p className="mt-1 font-semibold text-[#3B2415]">
                          {formatDateTime(
                            selectedBooking.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ================================================== */}
                  {/* NOTES */}
                  {/* ================================================== */}

                  {selectedBooking.notes && (
                    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

                      <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3C4]">

                          <MdNotes
                            size={22}
                            className="text-[#EA580C]"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                            Notes
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#3B2415]">
                            {selectedBooking.notes}
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* ================================================== */}
                  {/* ACTION BUTTONS */}
                  {/* ================================================== */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={handleEditClick}
                      disabled={
                        selectedBooking.bookingStatus ===
                        "CANCELLED"
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-5 py-3.5 text-sm font-bold text-[#EA580C] shadow-sm transition hover:bg-orange-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MdEdit size={20} />
                      Edit Booking
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={handleDeleteBooking}
                      disabled={
                        deleting ||
                        selectedBooking.bookingStatus ===
                          "CANCELLED"
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MdDelete size={20} />

                      {deleting
                        ? "Deleting..."
                        : "Delete Booking"}
                    </button>

                    {/* CLOSE */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBooking(null)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EA580C] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C2410C] hover:shadow-md"
                    >
                      <MdClose size={20} />
                      Close
                    </button>

                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
