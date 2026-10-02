"use client";

import { useEffect, useState } from "react";

import {
  MdCalendarMonth,
  MdCurrencyRupee,
  MdEventAvailable,
  MdHistory,
  MdVolunteerActivism,
} from "react-icons/md";

type Collection = {
  id: string;
  amount: number;
  year: number;
  contributionDate: string;
};

type Props = {
  year: number;
};

export default function CurrentYearSummary({ year }: Props) {
  const [totalCollection, setTotalCollection] = useState(0);
  const [totalCollections, setTotalCollections] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/payments?year=${year}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collection data.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch collection data."
          );
        }

        const collections: Collection[] = result.collections ?? [];

        const total = collections.reduce(
          (sum, collection) =>
            sum + Number(collection.amount || 0),
          0
        );

        if (!cancelled) {
          setTotalCollection(total);
          setTotalCollections(collections.length);
        }
      } catch (error) {
        console.error("Collection summary error:", error);

        if (!cancelled) {
          setTotalCollection(0);
          setTotalCollections(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [year]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      {/* Total Collection */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#FBBF24]/30 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FBBF24]/10" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#78716C]">
              Total Collection
            </p>

            {loading ? (
              <div className="mt-3 h-9 w-32 animate-pulse rounded-lg bg-[#FEF3C7]" />
            ) : (
              <h3 className="mt-2 text-3xl font-extrabold text-[#3B2415]">
                {formatAmount(totalCollection)}
              </h3>
            )}

            <p className="mt-2 text-xs text-[#A8A29E]">
              Collection for {year}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3C4]">
            <MdCurrencyRupee
              size={26}
              className="text-[#EA580C]"
            />
          </div>
        </div>
      </div>

      {/* Total Contributions */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#FBBF24]/30 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#EA580C]/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#78716C]">
              Contributions
            </p>

            {loading ? (
              <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-[#FEF3C7]" />
            ) : (
              <h3 className="mt-2 text-3xl font-extrabold text-[#3B2415]">
                {totalCollections}
              </h3>
            )}

            <p className="mt-2 text-xs text-[#A8A29E]">
              Contributions in {year}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3C4]">
            <MdVolunteerActivism
              size={26}
              className="text-[#EA580C]"
            />
          </div>
        </div>
      </div>

      {/* Year */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#FBBF24]/30 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2563EB]/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#78716C]">
              Selected Year
            </p>

            <h3 className="mt-2 text-3xl font-extrabold text-[#3B2415]">
              {year}
            </h3>

            <p className="mt-2 text-xs text-[#A8A29E]">
              Dashboard statistics
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF]">
            <MdCalendarMonth
              size={26}
              className="text-[#2563EB]"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
