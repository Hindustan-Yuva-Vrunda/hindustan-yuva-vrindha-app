"use client";

import { useEffect, useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdImage,
  MdRefresh,
} from "react-icons/md";

import GaneshaForm from "@/components/admin/GaneshaForm";

export type Ganesha = {
  id: string;
  year: number;
  title: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export default function GaneshaManagement() {
  const [ganeshas, setGaneshas] = useState<Ganesha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGanesha, setEditingGanesha] =
    useState<Ganesha | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const loadGaneshas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/ganesha", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load Ganesha records."
        );
        return;
      }

      // API response:
      // {
      //   success: true,
      //   data: [...]
      // }
      setGaneshas(data.data || []);
    } catch (error) {
      console.error("Load Ganesha error:", error);

      setError(
        "Something went wrong while loading Ganesha records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGaneshas();
  }, []);

  const handleAdd = () => {
    setEditingGanesha(null);
    setShowForm(true);
  };

  const handleEdit = (ganesha: Ganesha) => {
    setEditingGanesha(ganesha);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGanesha(null);
    loadGaneshas();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Ganesha record?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/admin/ganesha/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete Ganesha record."
        );
        return;
      }

      await loadGaneshas();
    } catch (error) {
      console.error("Delete Ganesha error:", error);

      alert(
        "Something went wrong while deleting the record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-[#FBBF24]/20 bg-white p-5 shadow-sm sm:p-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF3C4]">
              <MdImage
                size={24}
                className="text-[#EA580C]"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#3B2415]">
                Ganesha Gallery
              </h2>

              <p className="text-sm text-[#78716C]">
                Manage yearly Ganesha records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Refresh */}
          <button
            type="button"
            onClick={loadGaneshas}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#FBBF24]/40 px-4 py-2.5 text-sm font-semibold text-[#3B2415] transition hover:bg-[#FFF7E6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdRefresh
              size={19}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

          {/* Add */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C2410C]"
          >
            <MdAdd size={20} />

            Add Ganesha
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#FBBF24]/30 border-t-[#EA580C]" />

          <p className="text-sm text-[#78716C]">
            Loading Ganesha records...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadGaneshas}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        ganeshas.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#FBBF24]/40 bg-[#FFFDF5] px-6 py-14 text-center">
            <MdImage
              size={42}
              className="mx-auto text-[#FBBF24]"
            />

            <h3 className="mt-4 font-bold text-[#3B2415]">
              No Ganesha records yet
            </h3>

            <p className="mt-1 text-sm text-[#78716C]">
              Add the first yearly Ganesha record.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 rounded-xl bg-[#EA580C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#C2410C]"
            >
              Add Ganesha
            </button>
          </div>
        )}

      {/* Ganesha Cards */}
      {!loading &&
        !error &&
        ganeshas.length > 0 && (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {ganeshas.map((ganesha) => (
              <article
                key={ganesha.id}
                className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-[#FFFDF5] transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#FEF3C7]">
                  <img
                    src={ganesha.imageUrl}
                    alt={ganesha.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                  {/* Image fallback background */}
                  <div className="absolute inset-0 -z-0 flex items-center justify-center">
                    <MdImage
                      size={50}
                      className="text-[#FBBF24]/50"
                    />
                  </div>

                  {/* Year */}
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-extrabold text-[#EA580C] shadow-sm">
                    {ganesha.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#3B2415]">
                    {ganesha.title}
                  </h3>

                  {ganesha.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#78716C]">
                      {ganesha.description}
                    </p>
                  )}

                  {/* Image URL - useful while testing */}
                  <p className="mt-3 break-all text-xs text-[#A8A29E]">
                    {ganesha.imageUrl}
                  </p>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(ganesha)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFF3C4] px-4 py-2.5 text-sm font-bold text-[#92400E] transition hover:bg-[#FDE68A]"
                    >
                      <MdEdit size={18} />

                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={
                        deletingId === ganesha.id
                      }
                      onClick={() =>
                        handleDelete(ganesha.id)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MdDelete size={18} />

                      {deletingId === ganesha.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      {/* Add / Edit Modal */}
      {showForm && (
        <GaneshaForm
          ganesha={editingGanesha}
          onClose={() => {
            setShowForm(false);
            setEditingGanesha(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </section>
  );
}