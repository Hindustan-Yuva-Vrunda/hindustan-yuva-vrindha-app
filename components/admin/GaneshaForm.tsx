"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  MdClose,
  MdCloudUpload,
  MdImage,
  MdSave,
} from "react-icons/md";

import type { Ganesha } from "@/components/admin/GaneshaManagement";

type GaneshaFormProps = {
  ganesha: Ganesha | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function GaneshaForm({
  ganesha,
  onClose,
  onSuccess,
}: GaneshaFormProps) {
  const isEditing = Boolean(ganesha);

  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ganesha) {
      setYear(String(ganesha.year));
      setTitle(ganesha.title);
      setDescription(ganesha.description || "");
      setPreview(ganesha.imageUrl);
    } else {
      setYear("");
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview("");
    }

    setError("");
  }, [ganesha]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!year.trim()) {
      setError("Please enter the year.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!isEditing && !image) {
      setError("Please select a Ganesha image.");
      return;
    }

    const yearNumber = Number(year);

    if (!Number.isInteger(yearNumber)) {
      setError("Year must be a valid whole number.");
      return;
    }

    if (yearNumber < 1900 || yearNumber > 2100) {
      setError(
        "Please enter a valid year between 1900 and 2100."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("year", String(yearNumber));
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      if (image) {
        formData.append("image", image);
      }

      const url = isEditing
        ? `/api/admin/ganesha/${ganesha?.id}`
        : "/api/admin/ganesha";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } Ganesha.`
        );

        return;
      }

      onSuccess();
    } catch (error) {
      console.error("Ganesha form error:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-[#3B2415]/50
        p-3
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
    >
      <div
        className="
          relative
          my-3
          w-full
          max-w-2xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          sm:my-6
          sm:rounded-3xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-[#E7E5E4]
            px-4
            py-4
            sm:px-6
            sm:py-5
            md:px-7
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
                bg-[#FFF3C4]
                sm:h-11
                sm:w-11
                sm:rounded-2xl
              "
            >
              <MdImage
                size={22}
                className="text-[#EA580C] sm:size-6"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-black sm:text-xl">
                {isEditing ? "Edit Ganesha" : "Add Ganesha"}
              </h2>

              <p className="mt-0.5 text-xs leading-5 text-black sm:text-sm">
                {isEditing
                  ? "Update the yearly Ganesha record."
                  : "Add this year's Ganesha to the gallery."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-black
              transition
              hover:bg-[#F5F5F4]
              sm:h-10
              sm:w-10
            "
          >
            <MdClose size={22} className="sm:size-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            max-h-[calc(100vh-100px)]
            space-y-4
            overflow-y-auto
            p-4
            sm:max-h-[calc(100vh-120px)]
            sm:space-y-5
            sm:p-6
            md:p-7
          "
        >
          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-medium leading-5 text-red-600 sm:px-4 sm:text-sm">
              {error}
            </div>
          )}

          {/* Year */}
          <div>
            <label
              htmlFor="ganesha-year"
              className="mb-2 block text-sm font-bold text-black"
            >
              Year
            </label>

            <input
              id="ganesha-year"
              type="number"
              min="1900"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-[#D6D3D1]
                bg-white
                px-3
                py-3
                text-sm
                text-black
                outline-none
                placeholder:text-black/40
                focus:border-[#EA580C]
                focus:ring-2
                focus:ring-[#EA580C]/10
                sm:px-4
              "
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="ganesha-title"
              className="mb-2 block text-sm font-bold text-black"
            >
              Title
            </label>

            <input
              id="ganesha-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="2026 Ganesha Mahotsava"
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-[#D6D3D1]
                bg-white
                px-3
                py-3
                text-sm
                text-black
                outline-none
                placeholder:text-black/40
                focus:border-[#EA580C]
                focus:ring-2
                focus:ring-[#EA580C]/10
                sm:px-4
              "
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="ganesha-description"
              className="mb-2 block text-sm font-bold text-black"
            >
              Description

              <span className="ml-1 font-normal text-black/50">
                (Optional)
              </span>
            </label>

            <textarea
              id="ganesha-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Write a short description..."
              rows={4}
              disabled={loading}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-[#D6D3D1]
                bg-white
                px-3
                py-3
                text-sm
                leading-6
                text-black
                outline-none
                placeholder:text-black/40
                focus:border-[#EA580C]
                focus:ring-2
                focus:ring-[#EA580C]/10
                sm:px-4
              "
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-bold text-black">
              Ganesha Image
            </label>

            <label
              htmlFor="ganesha-image"
              className="
                flex
                min-h-[170px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-[#FBBF24]/50
                bg-[#FFFDF5]
                px-4
                py-6
                text-center
                transition
                hover:border-[#EA580C]
                hover:bg-[#FFF7E6]
                sm:min-h-[190px]
                sm:px-6
                sm:py-8
              "
            >
              <MdCloudUpload
                size={38}
                className="text-[#EA580C] sm:size-[42px]"
              />

              <p className="mt-3 max-w-full truncate px-2 text-xs font-bold text-black sm:text-sm">
                {image
                  ? image.name
                  : "Choose Ganesha image"}
              </p>

              <p className="mt-1 text-[10px] leading-4 text-black/60 sm:text-xs">
                JPG, JPEG, PNG or WEBP • Maximum 5 MB
              </p>

              <span className="mt-4 rounded-xl bg-[#EA580C] px-4 py-2 text-xs font-bold text-white">
                Browse Image
              </span>
            </label>

            <input
              id="ganesha-image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={loading}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="overflow-hidden rounded-2xl border border-[#E7E5E4]">
              <div className="border-b border-[#E7E5E4] bg-[#FFFDF5] px-3 py-2.5 sm:px-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black sm:text-xs">
                  Image Preview
                </p>
              </div>

              <div className="aspect-video w-full bg-[#FEF3C7]">
                <img
                  src={preview}
                  alt="Ganesha preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[#E7E5E4]
              pt-4
              sm:flex-row
              sm:justify-end
              sm:pt-5
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-[#D6D3D1]
                px-5
                py-3
                text-sm
                font-bold
                text-black
                transition
                hover:bg-[#F5F5F4]
                sm:w-auto
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#EA580C]
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#C2410C]
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              <MdSave size={19} />

              {loading
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Ganesha"
                : "Save Ganesha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}