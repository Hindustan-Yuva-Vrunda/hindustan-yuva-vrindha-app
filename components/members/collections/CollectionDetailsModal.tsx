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
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        min-h-dvh
        min-w-0
        items-center
        justify-center
        overflow-hidden
        bg-black/50
        p-3
        backdrop-blur-sm
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
          max-w-xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#EEE7DD]
          bg-[#FFFDFB]
          shadow-[0_25px_80px_rgba(59,36,21,0.25)]
          sm:max-h-[92dvh]
          sm:rounded-3xl
        "
      >
        {/* =====================================================
            HEADER - FIXED
        ====================================================== */}
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
                sm:h-12
                sm:w-12
                sm:rounded-2xl
              "
            >
              <MdReceiptLong
                size={22}
                className="sm:hidden"
              />

              <MdReceiptLong
                size={25}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-base
                  font-bold
                  text-[#292524]
                  sm:text-lg
                "
              >
                Collection Details
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-[#A8A29E]
                  sm:text-sm
                "
              >
                {formatDate(
                  collection.contributionDate
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close collection details"
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
              sm:h-10
              sm:w-10
            "
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* =====================================================
            AMOUNT - FIXED
            This section DOES NOT scroll.
        ====================================================== */}
        <div
          className="
            shrink-0
            border-b
            border-[#EEE7DD]
            bg-[#FFFDFB]
            px-3
            py-3
            sm:px-6
            sm:py-4
          "
        >
          <div
            className="
              relative
              w-full
              min-w-0
              overflow-hidden
              rounded-xl
              border
              border-[#F4D58D]
              bg-linear-to
              from-[#FFF8E8]
              via-[#FFF3D2]
              to-[#FFF9EE]
              px-3
              py-3
              shadow-sm
              sm:rounded-2xl
              sm:px-5
              sm:py-4
            "
          >
            {/* Decorative glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-[#FBBF24]/20
                blur-2xl
                sm:h-24
                sm:w-24
              "
            />

            <div
              className="
                relative
                flex
                min-w-0
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <p
                className="
                  max-w-full
                  truncate
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#A16207]
                  sm:text-xs
                  sm:tracking-[0.16em]
                "
              >
                Amount Collected
              </p>

              <p
                className="
                  mt-1
                  max-w-full
                  min-w-0
                  wrap-break-word
                  wrap:anywhere
                  text-2xl
                  font-extrabold
                  leading-tight
                  tracking-tight
                  text-[#EA580C]
                  sm:mt-1.5
                  sm:text-4xl
                "
              >
                {formatAmount(collection.amount)}
              </p>

              <div
                className="
                  mt-2
                  flex
                  max-w-full
                  min-w-0
                  items-center
                  justify-center
                  gap-1
                  rounded-full
                  border
                  border-[#F3E4C2]
                  bg-white/90
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  leading-none
                  text-[#92400E]
                  shadow-sm
                  sm:mt-2.5
                  sm:px-3
                  sm:py-1.5
                  sm:text-xs
                "
              >
                <MdPayments
                  size={14}
                  className="
                    shrink-0
                    sm:h-4
                    sm:w-4
                  "
                />

                <span className="min-w-0 truncate">
                  {getPaymentLabel(
                    collection.paymentMode
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            DETAILS - ONLY THIS AREA SCROLLS
        ====================================================== */}
        <div
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            overscroll-contain
            px-3
            py-3
            sm:px-6
            sm:py-5
          "
        >
          <div
            className="
              grid
              min-w-0
              grid-cols-1
              gap-3
              sm:grid-cols-2
              sm:gap-4
            "
          >
            {/* Contributor */}
            <Detail
              icon={<MdPerson size={19} />}
              label="Contributor"
              value={
                collection.contributorName ||
                "Not provided"
              }
            />

            {/* Phone */}
            <Detail
              icon={<MdPhone size={19} />}
              label="Phone"
              value={
                collection.contributorPhone ||
                "Not provided"
              }
            />

            {/* Year */}
            <Detail
              icon={<MdCalendarMonth size={19} />}
              label="Year"
              value={String(collection.year)}
            />

            {/* Payment */}
            <Detail
              icon={<MdPayments size={19} />}
              label="Payment"
              value={getPaymentLabel(
                collection.paymentMode
              )}
            />

            {/* Address */}
            <div className="min-w-0 sm:col-span-2">
              <Detail
                icon={<MdLocationOn size={19} />}
                label="Address"
                value={
                  collection.contributorAddress ||
                  "Not provided"
                }
              />
            </div>

            {/* Purpose */}
            <div className="min-w-0 sm:col-span-2">
              <Detail
                icon={<MdReceiptLong size={19} />}
                label="Purpose"
                value={
                  collection.purpose ||
                  "Not provided"
                }
              />
            </div>

            {/* Notes */}
            {collection.notes && (
              <div className="min-w-0 sm:col-span-2">
                <Detail
                  icon={<MdNotes size={19} />}
                  label="Notes"
                  value={collection.notes}
                />
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            ACTIONS - FIXED
        ====================================================== */}
        <div
          className="
            shrink-0
            border-t
            border-[#EEE7DD]
            bg-[#FFFDFB]
            px-3
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
              onClick={() =>
                onDelete(collection)
              }
              className="
                inline-flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-white
                px-4
                text-sm
                font-bold
                text-red-600
                transition-all
                duration-200
                hover:bg-red-50
                active:scale-[0.98]
                sm:h-10
                sm:w-auto
              "
            >
              <MdDelete size={18} />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onEdit(collection)
              }
              className="
                inline-flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#EA580C]
                px-5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#C2410C]
                hover:shadow-md
                active:scale-[0.98]
                sm:h-10
                sm:w-auto
              "
            >
              <MdEdit size={18} />
              <span>Edit Collection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL CARD
============================================================ */

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
    <div
      className="
        min-w-0
        w-full
        overflow-hidden
        rounded-xl
        border
        border-[#EEE7DD]
        bg-[#FFFCF7]
        p-3
        sm:p-3.5
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-orange-50
            text-[#EA580C]
          "
        >
          {icon}
        </div>

        <span
          className="
            min-w-0
            truncate
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            text-[#A8A29E]
            sm:text-xs
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-2
          min-w-0
          wrap-break-word
          wrap:anywhere
          text-sm
          font-semibold
          leading-5
          text-[#292524]
        "
      >
        {value}
      </p>
    </div>
  );
}