"use client";

import { MdAdd, MdPayments } from "react-icons/md";

import type { Collection } from "./collection.types";

import CollectionCard from "./CollectionCard";

type Props = {
  collections: Collection[];
  loading: boolean;
  year: number;
  onSelect: (collection: Collection) => void;
  onAdd: () => void;
};

export default function CollectionList({
  collections,
  loading,
  year,
  onSelect,
  onAdd,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-52 animate-pulse rounded-2xl border border-[#E7E0D5] bg-white"
          />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D6CEC1] bg-white px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#EA580C]">
          <MdPayments size={28} />
        </div>

        <h3 className="text-lg font-bold text-[#292524]">
          No collections found
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#78716C]">
          There are no collections recorded for{" "}
          {year}.
        </p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#EA580C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C2410C]"
        >
          <MdAdd size={19} />

          Add Collection
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onClick={() => onSelect(collection)}
        />
      ))}
    </div>
  );
}
