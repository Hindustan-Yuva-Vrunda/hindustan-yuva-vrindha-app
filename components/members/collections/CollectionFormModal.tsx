"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  MdClose,
  MdLocationOn,
  MdNotes,
  MdPayments,
  MdPerson,
  MdPhone,
} from "react-icons/md";

import type {
  Collection,
  CollectionFormData,
} from "./collection.types";

import {
  createEmptyCollectionForm,
} from "./collection.utils";

type Props = {
  open: boolean;
  year: number;
  collection?: Collection | null;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (data: CollectionFormData) => void;
};

export default function CollectionFormModal({
  open,
  year,
  collection,
  loading = false,
  error = "",
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<CollectionFormData>(
      createEmptyCollectionForm()
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (collection) {
      setForm({
        contributorName:
          collection.contributorName || "",

        contributorPhone:
          collection.contributorPhone || "",

        contributorAddress:
          collection.contributorAddress || "",

        amount: String(
          collection.amount || ""
        ),

        paymentMode:
          collection.paymentMode,

        purpose:
          collection.purpose || "",

        contributionDate:
          new Date(
            collection.contributionDate
          )
            .toISOString()
            .split("T")[0],

        notes:
          collection.notes || "",
      });

      return;
    }

    setForm(createEmptyCollectionForm());
  }, [open, collection]);

  if (!open) {
    return null;
  }

  function updateField<
    K extends keyof CollectionFormData
  >(
    field: K,
    value: CollectionFormData[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    onSubmit(form);
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        min-h-dvh
        items-center
        justify-center
        overflow-hidden
        bg-[#1C1917]/55
        p-3
        backdrop-blur-[6px]
        sm:p-4
      "
    >
      <div
        className="
          relative
          flex
          max-h-[94dvh]
          w-full
          min-w-0
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-[#F0E5D2]
          bg-[#FFFDFB]
          shadow-[0_25px_80px_rgba(59,36,21,0.28)]
          sm:max-h-[92dvh]
          sm:rounded-[30px]
        "
      >
        {/* Decorative top glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-24
            w-72
            -translate-x-1/2
            rounded-full
            bg-[#FBBF24]/10
            blur-3xl
          "
        />

        {/* Header */}
        <div
          className="
            relative
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            border-b
            border-[#EEE7DD]
            bg-[#FFFDFB]
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-orange-50
                text-[#EA580C]
                shadow-sm
                sm:h-11
                sm:w-11
                sm:rounded-2xl
              "
            >
              <MdPayments
                size={21}
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-base
                  font-bold
                  text-[#292524]
                  sm:text-xl
                "
              >
                {collection
                  ? "Edit Collection"
                  : "Add Collection"}
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-[#78716C]
                  sm:text-sm
                "
              >
                Collection year:{" "}
                <span className="font-bold text-[#EA580C]">
                  {year}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close collection form"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#78716C]
              transition-all
              duration-200
              hover:bg-[#F5F1EA]
              hover:text-[#292524]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-10
              sm:w-10
            "
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-hidden
          "
        >
          {/* Scrollable content */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-4
              py-4
              sm:px-6
              sm:py-5
            "
          >
            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  leading-5
                  text-red-700
                  wrap-break-words
                "
              >
                {error}
              </div>
            )}

            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-4
                sm:grid-cols-2
                sm:gap-5
              "
            >
              {/* Contributor Name */}
              <div className="min-w-0 sm:col-span-2">
                <label
                  htmlFor="contributorName"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Contributor Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <MdPerson
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#A8A29E]
                    "
                  />

                  <input
                    id="contributorName"
                    type="text"
                    value={
                      form.contributorName
                    }
                    onChange={(event) =>
                      updateField(
                        "contributorName",
                        event.target.value
                      )
                    }
                    placeholder="Enter contributor name"
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-[#DDD6CE]
                      bg-white
                      pl-10
                      pr-3
                      text-sm
                      text-[#292524]
                      outline-none
                      transition
                      placeholder:text-[#A8A29E]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-orange-100
                    "
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="min-w-0">
                <label
                  htmlFor="contributorPhone"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Phone Number
                </label>

                <div className="relative">
                  <MdPhone
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#A8A29E]
                    "
                  />

                  <input
                    id="contributorPhone"
                    type="tel"
                    value={
                      form.contributorPhone
                    }
                    onChange={(event) =>
                      updateField(
                        "contributorPhone",
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="10 digit phone"
                    inputMode="numeric"
                    maxLength={10}
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-[#DDD6CE]
                      bg-white
                      pl-10
                      pr-3
                      text-sm
                      text-[#292524]
                      outline-none
                      transition
                      placeholder:text-[#A8A29E]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-orange-100
                    "
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="min-w-0">
                <label
                  htmlFor="amount"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Amount
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <span
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      font-bold
                      text-[#78716C]
                    "
                  >
                    ₹
                  </span>

                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(event) =>
                      updateField(
                        "amount",
                        event.target.value
                      )
                    }
                    placeholder="Enter amount"
                    inputMode="decimal"
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-[#DDD6CE]
                      bg-white
                      pl-8
                      pr-3
                      text-sm
                      text-[#292524]
                      outline-none
                      transition
                      placeholder:text-[#A8A29E]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-orange-100
                    "
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div className="min-w-0">
                <label
                  htmlFor="paymentMode"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Payment Mode
                </label>

                <select
                  id="paymentMode"
                  value={form.paymentMode}
                  onChange={(event) =>
                    updateField(
                      "paymentMode",
                      event.target
                        .value as CollectionFormData["paymentMode"]
                    )
                  }
                  className="
                    h-11
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-[#DDD6CE]
                    bg-white
                    px-3
                    text-sm
                    text-[#292524]
                    outline-none
                    transition
                    focus:border-[#F97316]
                    focus:ring-2
                    focus:ring-orange-100
                  "
                  disabled={loading}
                >
                  <option value="CASH">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>

              {/* Collection Date */}
              <div className="min-w-0">
                <label
                  htmlFor="contributionDate"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Collection Date
                </label>

                <input
                  id="contributionDate"
                  type="date"
                  value={
                    form.contributionDate
                  }
                  onChange={(event) =>
                    updateField(
                      "contributionDate",
                      event.target.value
                    )
                  }
                  className="
                    h-11
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-[#DDD6CE]
                    bg-white
                    px-3
                    text-sm
                    text-[#292524]
                    outline-none
                    transition
                    focus:border-[#F97316]
                    focus:ring-2
                    focus:ring-orange-100
                  "
                  required
                  disabled={loading}
                />
              </div>

              {/* Address */}
              <div className="min-w-0 sm:col-span-2">
                <label
                  htmlFor="contributorAddress"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Contributor Address
                </label>

                <div className="relative">
                  <MdLocationOn
                    size={20}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-3
                      text-[#A8A29E]
                    "
                  />

                  <textarea
                    id="contributorAddress"
                    value={
                      form.contributorAddress
                    }
                    onChange={(event) =>
                      updateField(
                        "contributorAddress",
                        event.target.value
                      )
                    }
                    placeholder="Enter contributor address"
                    rows={3}
                    className="
                      min-h-22
                      w-full
                      min-w-0
                      resize-none
                      rounded-xl
                      border
                      border-[#DDD6CE]
                      bg-white
                      py-2.5
                      pl-10
                      pr-3
                      text-sm
                      leading-5
                      text-[#292524]
                      outline-none
                      transition
                      placeholder:text-[#A8A29E]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-orange-100
                    "
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="min-w-0 sm:col-span-2">
                <label
                  htmlFor="purpose"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Purpose
                </label>

                <input
                  id="purpose"
                  type="text"
                  value={form.purpose}
                  onChange={(event) =>
                    updateField(
                      "purpose",
                      event.target.value
                    )
                  }
                  placeholder="Ganeshotsav Contribution"
                  className="
                    h-11
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-[#DDD6CE]
                    bg-white
                    px-3
                    text-sm
                    text-[#292524]
                    outline-none
                    transition
                    placeholder:text-[#A8A29E]
                    focus:border-[#F97316]
                    focus:ring-2
                    focus:ring-orange-100
                  "
                  disabled={loading}
                />
              </div>

              {/* Notes */}
              <div className="min-w-0 sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#292524]
                  "
                >
                  Notes
                </label>

                <div className="relative">
                  <MdNotes
                    size={20}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-3
                      text-[#A8A29E]
                    "
                  />

                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(event) =>
                      updateField(
                        "notes",
                        event.target.value
                      )
                    }
                    placeholder="Additional notes"
                    rows={3}
                    className="
                      min-h-22
                      w-full
                      min-w-0
                      resize-none
                      rounded-xl
                      border
                      border-[#DDD6CE]
                      bg-white
                      py-2.5
                      pl-10
                      pr-3
                      text-sm
                      leading-5
                      text-[#292524]
                      outline-none
                      transition
                      placeholder:text-[#A8A29E]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-orange-100
                    "
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Actions */}
          <div
            className="
              shrink-0
              border-t
              border-[#EEE7DD]
              bg-[#FFFDFB]
              px-4
              pb-[calc(0.75rem+env(safe-area-inset-bottom))]
              pt-3
              sm:px-6
              sm:py-4
            "
          >
            <div
              className="
                flex
                flex-col-reverse
                gap-2.5
                sm:flex-row
                sm:justify-end
                sm:gap-3
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  inline-flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#DDD6CE]
                  bg-white
                  px-5
                  text-sm
                  font-bold
                  text-[#57534E]
                  transition-all
                  duration-200
                  hover:bg-[#F8F5F0]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  inline-flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#EA580C]
                  px-6
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#C2410C]
                  hover:shadow-md
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />

                    <span>
                      Saving...
                    </span>
                  </>
                ) : (
                  <>
                    <MdPayments
                      size={19}
                    />

                    <span>
                      {collection
                        ? "Update Collection"
                        : "Save Collection"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}