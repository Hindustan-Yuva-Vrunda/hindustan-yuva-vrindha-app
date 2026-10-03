"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import CollectionDetailsModal from "./collections/CollectionDetailsModal";
import CollectionFormModal from "./collections/CollectionFormModal";
import CollectionHeader from "./collections/CollectionHeader";
import CollectionList from "./collections/CollectionList";
import CollectionSummary from "./collections/CollectionSummary";
import CollectionToolbar from "./collections/CollectionToolbar";
import { generateCollectionPdf } from "@/lib/generateCollectionListsPDF";

import type {
  Collection,
  CollectionFormData,
} from "./collections/collection.types";

import { getCurrentYear } from "./collections/collection.utils";

export default function CollectionsSection() {
  // ==================================================
  // YEAR
  // ==================================================

  const [year, setYear] = useState<number>(getCurrentYear());

  // ==================================================
  // COLLECTIONS
  // ==================================================

  const [collections, setCollections] = useState<Collection[]>([]);

  // ==================================================
  // UI STATE
  // ==================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  // ==================================================
  // MODAL STATE
  // ==================================================

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [editingCollection, setEditingCollection] =
    useState<Collection | null>(null);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  // ==================================================
  // LOAD COLLECTIONS
  // ==================================================

  const loadCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/payments?year=${year}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load collections."
        );
      }

      setCollections(result.collections || []);
    } catch (error) {
      console.error("Load collections error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load collections."
      );
    } finally {
      setLoading(false);
    }
  }, [year]);

  // ==================================================
  // LOAD WHEN YEAR CHANGES
  // ==================================================

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // ==================================================
  // OPEN CREATE MODAL
  // ==================================================

  function handleAddCollection() {
    setError("");
    setSuccess("");

    setEditingCollection(null);
    setFormOpen(true);
  }

  // ==================================================
  // OPEN EDIT MODAL
  // ==================================================

  function handleEditCollection(collection: Collection) {
    setError("");
    setSuccess("");

    setSelectedCollection(null);
    setDetailsOpen(false);

    setEditingCollection(collection);
    setFormOpen(true);
  }

  // ==================================================
  // CREATE COLLECTION
  // ==================================================

  async function createCollection(form: CollectionFormData) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // -----------------------------------------------
      // Frontend validation
      // -----------------------------------------------

      if (!form.contributorName.trim()) {
        throw new Error("Contributor name is required.");
      }

      const amount = Number(form.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Amount must be greater than 0.");
      }

      if (!form.contributionDate) {
        throw new Error("Collection date is required.");
      }

      // -----------------------------------------------
      // API request
      // -----------------------------------------------

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contributorName: form.contributorName.trim(),
          contributorPhone: form.contributorPhone.trim(),
          contributorAddress: form.contributorAddress.trim(),
          amount,
          paymentMode: form.paymentMode,
          purpose: form.purpose.trim(),
          year,
          contributionDate: form.contributionDate,
          notes: form.notes.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create collection."
        );
      }

      // -----------------------------------------------
      // Update local list
      // -----------------------------------------------

      if (result.collection) {
        setCollections((previous) => [
          result.collection,
          ...previous,
        ]);
      } else {
        await loadCollections();
      }

      // -----------------------------------------------
      // Close modal
      // -----------------------------------------------

      setFormOpen(false);
      setEditingCollection(null);

      setSuccess("Collection added successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Create collection error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create collection."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // UPDATE COLLECTION
  // ==================================================

  async function updateCollection(form: CollectionFormData) {
    if (!editingCollection) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // -----------------------------------------------
      // Validation
      // -----------------------------------------------

      if (!form.contributorName.trim()) {
        throw new Error("Contributor name is required.");
      }

      const amount = Number(form.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Amount must be greater than 0.");
      }

      if (!form.contributionDate) {
        throw new Error("Collection date is required.");
      }

      // -----------------------------------------------
      // API request
      // -----------------------------------------------

      const response = await fetch(
        `/api/payments/${editingCollection.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contributorName: form.contributorName.trim(),
            contributorPhone: form.contributorPhone.trim(),
            contributorAddress: form.contributorAddress.trim(),
            amount,
            paymentMode: form.paymentMode,
            purpose: form.purpose.trim(),
            year,
            contributionDate: form.contributionDate,
            notes: form.notes.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update collection."
        );
      }

      // -----------------------------------------------
      // Update local list
      // -----------------------------------------------

      if (result.collection) {
        setCollections((previous) =>
          previous.map((item) =>
            item.id === editingCollection.id
              ? result.collection
              : item
          )
        );
      } else {
        await loadCollections();
      }

      // -----------------------------------------------
      // Close modal
      // -----------------------------------------------

      setFormOpen(false);
      setEditingCollection(null);

      setSuccess("Collection updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Update collection error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update collection."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // FORM SUBMIT
  // ==================================================

  async function handleFormSubmit(form: CollectionFormData) {
    if (editingCollection) {
      await updateCollection(form);
      return;
    }

    await createCollection(form);
  }

  // ==================================================
  // DELETE COLLECTION
  // ==================================================

  async function handleDeleteCollection(
    collection: Collection
  ) {
    const confirmed = window.confirm(
      `Delete collection from ${collection.contributorName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/payments/${collection.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete collection."
        );
      }

      setCollections((previous) =>
        previous.filter(
          (item) => item.id !== collection.id
        )
      );

      setSelectedCollection(null);
      setDetailsOpen(false);

      setSuccess("Collection deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Delete collection error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete collection."
      );
    }
  }

  // ==================================================
  // FILTER COLLECTIONS
  // ==================================================

  const filteredCollections = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return collections;
    }

    return collections.filter((collection) => {
      return (
        collection.contributorName
          .toLowerCase()
          .includes(value) ||
        (collection.contributorPhone || "")
          .toLowerCase()
          .includes(value) ||
        (collection.purpose || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [collections, search]);

  // ==================================================
  // SUMMARY
  // ==================================================

  const totalAmount = useMemo(() => {
    return collections.reduce(
      (total, collection) =>
        total + Number(collection.amount || 0),
      0
    );
  }, [collections]);

  // Keep calculated value available for future summary
  void totalAmount;

  // ==================================================
  // OPEN DETAILS
  // ==================================================

  function handleOpenDetails(collection: Collection) {
    setError("");

    setSelectedCollection(collection);
    setDetailsOpen(true);
  }

  // ==================================================
  // CLOSE FORM
  // ==================================================

  function handleCloseForm() {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingCollection(null);
    setError("");
  }

  // ==================================================
  // CLOSE DETAILS
  // ==================================================

  function handleCloseDetails() {
    setDetailsOpen(false);
    setSelectedCollection(null);
  }


  async function handleExportCollectionsPdf() {
  try {
    setError("");

    await generateCollectionPdf(
      collections,
      year
    );
  } catch (error) {
    console.error(
      "Export collections PDF error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Unable to export collection PDF."
    );
  }
}
  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section
      className="
        min-h-screen
        min-w-0
        overflow-x-hidden
        bg-[#FFFDF5]
        px-3
        py-4
        sm:px-5
        sm:py-6
        md:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          w-full
          min-w-0
          max-w-7xl
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="min-w-0">
          <CollectionHeader onAdd={handleAddCollection}
           onExport={handleExportCollectionsPdf} 
          />
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {success && (
          <div
            className="
              mb-4
              w-full
              min-w-0
              overflow-hidden
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-3
              py-3
              text-sm
              font-semibold
              text-green-700
              sm:mb-5
              sm:px-4
            "
          >
            <p className="break-words">{success}</p>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && !formOpen && (
          <div
            className="
              mb-4
              w-full
              min-w-0
              overflow-hidden
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3
              py-3
              text-sm
              font-semibold
              text-red-700
              sm:mb-5
              sm:px-4
            "
          >
            <p className="break-words">{error}</p>
          </div>
        )}

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="min-w-0">
          <CollectionSummary
            collections={collections}
            year={year}
          />
        </div>

        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <div className="mt-4 min-w-0 sm:mt-5">
          <CollectionToolbar
            year={year}
            search={search}
            onYearChange={setYear}
            onSearchChange={setSearch}
          />
        </div>

        {/* ==================================================
            COLLECTION LIST
        ================================================== */}

        <div
          className="
            mt-4
            min-w-0
            overflow-hidden
            sm:mt-5
          "
        >
          <CollectionList
            collections={filteredCollections}
            loading={loading}
            year={year}
            onAdd={handleAddCollection}
            onSelect={handleOpenDetails}
          />
        </div>
      </div>

      {/* ==================================================
          CREATE / EDIT MODAL
      ================================================== */}

      <CollectionFormModal
        open={formOpen}
        year={year}
        collection={editingCollection}
        loading={saving}
        error={formOpen ? error : ""}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {detailsOpen && selectedCollection && (
        <CollectionDetailsModal
          collection={selectedCollection}
          onClose={handleCloseDetails}
          onEdit={handleEditCollection}
          onDelete={handleDeleteCollection}
        />
      )}
    </section>
  );
}