"use client";

import {
  MdCalendarMonth,
  MdClose,
  MdDelete,
  MdEdit,
  MdLocationOn,
  MdNotes,
  MdPayments,
  MdPerson,
  MdPhone,
  MdReceiptLong,
} from "react-icons/md";

import type { Collection } from "./collection.types";

import {
  formatAmount,
  formatDate,
  getPaymentLabel,
} from "./collection.utils";

type Props = {
  collection: Collection | null;
  onClose: () => void;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
};

export default function CollectionDetailsModal({
  collection,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!collection) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EEE7DD] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#EA580C]">
              <MdReceiptLong size={25} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#292524]">
                Collection Details
              </h2>

              <p className="text-xs text-[#A8A29E]">
                {formatDate(
                  collection.contributionDate
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#78716C] hover:bg-[#F5F1EA]"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Amount */}
        <div className="mx-5 mt-5 rounded-2xl bg-[#FFF7E6] p-5 text-center sm:mx-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A16207]">
            Amount Collected
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#EA580C]">
            {formatAmount(collection.amount)}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#92400E] shadow-sm">
            {getPaymentLabel(
              collection.paymentMode
            )}
          </span>
        </div>

        {/* Details */}
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <Detail
            icon={<MdPerson size={19} />}
            label="Contributor"
            value={collection.contributorName}
          />

          <Detail
            icon={<MdPhone size={19} />}
            label="Phone"
            value={
              collection.contributorPhone ||
              "Not provided"
            }
          />

          <Detail
            icon={<MdCalendarMonth size={19} />}
            label="Year"
            value={String(collection.year)}
          />

          <Detail
            icon={<MdPayments size={19} />}
            label="Payment"
            value={getPaymentLabel(
              collection.paymentMode
            )}
          />

          <div className="sm:col-span-2">
            <Detail
              icon={<MdLocationOn size={19} />}
              label="Address"
              value={
                collection.contributorAddress ||
                "Not provided"
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Detail
              icon={<MdReceiptLong size={19} />}
              label="Purpose"
              value={
                collection.purpose ||
                "Not provided"
              }
            />
          </div>

          {collection.notes && (
            <div className="sm:col-span-2">
              <Detail
                icon={<MdNotes size={19} />}
                label="Notes"
                value={collection.notes}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#EEE7DD] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            disabled
            onClick={() => onDelete(collection)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <MdDelete size={18}  />

            Delete
          </button>

          <button
            type="button"
            onClick={() => onEdit(collection)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-5 text-sm font-bold text-white hover:bg-[#C2410C]"
          >
            <MdEdit size={18} />

            Edit Collection
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#EEE7DD] bg-[#FFFCF7] p-3.5">
      <div className="flex items-center gap-2 text-[#EA580C]">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-[#A8A29E]">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-[#292524]">
        {value}
      </p>
    </div>
  );
}
