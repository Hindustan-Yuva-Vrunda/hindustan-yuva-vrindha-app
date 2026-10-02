"use client";

import {
  MdCalendarMonth,
  MdSearch,
} from "react-icons/md";

import { getYearOptions } from "./collection.utils";

type Props = {
  year: number;
  search: string;
  onYearChange: (year: number) => void;
  onSearchChange: (value: string) => void;
};

export default function CollectionToolbar({
  year,
  search,
  onYearChange,
  onSearchChange,
}: Props) {
  const years = getYearOptions();

  return (
    <div className="mb-6 rounded-2xl border border-[#E7E0D5] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Year */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706]">
            <MdCalendarMonth size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#A8A29E]">
              Collection Year
            </p>

            <select
              value={year}
              onChange={(event) =>
                onYearChange(
                  Number(event.target.value)
                )
              }
              className="mt-0.5 bg-transparent text-sm font-bold text-[#292524] outline-none"
            >
              {years.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <MdSearch
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search contributor..."
            className="h-10 w-full rounded-xl border border-[#E7E0D5] bg-[#FFFDF5] pl-10 pr-3 text-sm text-[#292524] outline-none transition placeholder:text-[#A8A29E] focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>
    </div>
  );
}
