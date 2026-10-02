import {
  MdPayments,
  MdReceiptLong,
} from "react-icons/md";

import type { Collection } from "./collection.types";
import { formatAmount } from "./collection.utils";

type Props = {
  collections: Collection[];
  year: number;
};

export default function CollectionSummary({
  collections,
  year,
}: Props) {
  const totalAmount = collections.reduce(
    (total, collection) =>
      total + Number(collection.amount || 0),
    0
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Total Amount */}
      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#EA580C]">
            <MdPayments size={22} />
          </div>

          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#EA580C]">
            {year}
          </span>
        </div>

        <p className="text-sm font-medium text-[#78716C]">
          Total Collection
        </p>

        <p className="mt-1 text-2xl font-bold text-[#292524]">
          {formatAmount(totalAmount)}
        </p>
      </div>

      {/* Total Records */}
      <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#D97706]">
          <MdReceiptLong size={22} />
        </div>

        <p className="text-sm font-medium text-[#78716C]">
          Total Contributions
        </p>

        <p className="mt-1 text-2xl font-bold text-[#292524]">
          {collections.length}
        </p>
      </div>
    </div>
  );
}

