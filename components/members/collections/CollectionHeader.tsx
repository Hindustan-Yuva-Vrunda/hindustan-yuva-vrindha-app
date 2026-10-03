"use client";

import {
  MdAdd,
  MdPayments,
  MdPictureAsPdf,
} from "react-icons/md";

type Props = {
  onAdd: () => void;
  onExport: () => void;
};

export default function CollectionHeader({
  onAdd,
  onExport,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
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

      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
        <button
          type="button"
          onClick={onExport}
          className="
            inline-flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#FBBF24]
            bg-[#FFF7E6]
            px-5
            text-sm
            font-bold
            text-[#EA580C]
            shadow-sm
            transition
            hover:bg-[#FEF3C7]
            active:scale-[0.98]
            sm:w-auto
          "
        >
          <MdPictureAsPdf size={21} />

          Export PDF
        </button>

        <button
          type="button"
          onClick={onAdd}
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
            transition
            hover:bg-[#C2410C]
            active:scale-[0.98]
            sm:w-auto
          "
        >
          <MdAdd size={22} />

          Add Collection
        </button>
      </div>
    </div>
  );
}