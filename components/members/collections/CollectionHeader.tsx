"use client";

import { MdAdd, MdPayments } from "react-icons/md";

type Props = {
  onAdd: () => void;
};

export default function CollectionHeader({
  onAdd,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#EA580C]">
          <MdPayments size={18} />

          Collection Management
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#292524] sm:text-3xl">
          Collections
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#78716C]">
          Record and manage contributions collected
          from devotees.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C2410C] active:scale-[0.98]"
      >
        <MdAdd size={22} />

        Add Collection
      </button>
    </div>
  );
}

