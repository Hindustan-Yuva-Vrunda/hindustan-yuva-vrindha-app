import {
  MdPerson,
  MdVisibility,
} from "react-icons/md";

import type { Collection } from "./collection.types";

import {
  formatAmount,
  formatDate,
  getPaymentLabel,
} from "./collection.utils";

type Props = {
  collection: Collection;
  onClick: () => void;
};

export default function CollectionCard({
  collection,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[#E7E0D5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#EA580C]">
            <MdPerson size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-[#292524]">
              {collection.contributorName}
            </h3>

            <p className="mt-0.5 text-xs text-[#A8A29E]">
              {formatDate(
                collection.contributionDate
              )}
            </p>
          </div>
        </div>

        <MdVisibility
          size={20}
          className="shrink-0 text-[#C4BDB4] transition group-hover:text-[#EA580C]"
        />
      </div>

      <div className="my-5 h-px bg-[#F0EBE4]" />

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#A8A29E]">
            Contribution
          </p>

          <p className="mt-1 text-xl font-extrabold text-[#EA580C]">
            {formatAmount(collection.amount)}
          </p>
        </div>

        <span className="rounded-full bg-[#FEF3C7] px-3 py-1.5 text-xs font-bold text-[#92400E]">
          {getPaymentLabel(
            collection.paymentMode
          )}
        </span>
      </div>

      {collection.purpose && (
        <p className="mt-4 truncate text-xs text-[#78716C]">
          {collection.purpose}
        </p>
      )}
    </button>
  );
}
