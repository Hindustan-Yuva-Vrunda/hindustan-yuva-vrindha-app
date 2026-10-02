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
  onSubmit: (
    data: CollectionFormData
  ) => void;
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

        notes: collection.notes || "",
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

    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEE7DD] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#292524] sm:text-xl">
              {collection
                ? "Edit Collection"
                : "Add Collection"}
            </h2>

            <p className="mt-0.5 text-xs text-[#78716C]">
              Collection year:{" "}
              <span className="font-bold text-[#EA580C]">
                {year}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#78716C] transition hover:bg-[#F5F1EA]"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 sm:px-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Contributor Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <MdPerson
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                />

                <input
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
                  className="h-11 w-full rounded-xl border border-[#DDD6CE] bg-white pl-10 pr-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Phone Number
              </label>

              <div className="relative">
                <MdPhone
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                />

                <input
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
                  className="h-11 w-full rounded-xl border border-[#DDD6CE] bg-white pl-10 pr-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Amount
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#78716C]">
                  ₹
                </span>

                <input
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
                  className="h-11 w-full rounded-xl border border-[#DDD6CE] bg-white pl-8 pr-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Payment Mode
              </label>

              <select
                value={form.paymentMode}
                onChange={(event) =>
                  updateField(
                    "paymentMode",
                    event.target.value as CollectionFormData["paymentMode"]
                  )
                }
                className="h-11 w-full rounded-xl border border-[#DDD6CE] bg-white px-3 text-sm text-[#292524] outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
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

            {/* Date */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Collection Date
              </label>

              <input
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
                className="h-11 w-full rounded-xl border border-[#DDD6CE] bg-white px-3 text-sm text-[#292524] outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Contributor Address
              </label>

              <div className="relative">
                <MdLocationOn
                  size={20}
                  className="absolute left-3 top-3 text-[#A8A29E]"
                />

                <textarea
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
                  className="w-full resize-none rounded-xl border border-[#DDD6CE] bg-white py-2.5 pl-10 pr-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Purpose
              </label>

              <input
                type="text"
                value={form.purpose}
                onChange={(event) =>
                  updateField(
                    "purpose",
                    event.target.value
                  )
                }
                placeholder="Ganeshotsav Contribution"
                className="h-11 w-full rounded-xl border border-[#DDD6CE] bg-white px-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-[#292524]">
                Notes
              </label>

              <div className="relative">
                <MdNotes
                  size={20}
                  className="absolute left-3 top-3 text-[#A8A29E]"
                />

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value
                    )
                  }
                  placeholder="Additional notes"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#DDD6CE] bg-white py-2.5 pl-10 pr-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-xl border border-[#DDD6CE] px-5 text-sm font-bold text-[#57534E] hover:bg-[#F8F5F0] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-6 text-sm font-bold text-white hover:bg-[#C2410C] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                  Saving...
                </>
              ) : (
                <>
                  <MdPayments size={19} />

                  {collection
                    ? "Update Collection"
                    : "Save Collection"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
