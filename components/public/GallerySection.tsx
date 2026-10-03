"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  MdAutoAwesome,
  MdCalendarMonth,
  MdClose,
  MdImage,
} from "react-icons/md";

type Ganesha = {
  id: string;
  year: number;
  title: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type DustParticle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  type: "orange" | "gold" | "yellow";
};

/**
 * Deterministic decorative dust particles.
 *
 * IMPORTANT:
 * Do not use Math.random() here.
 * The same values must be rendered on both server and client
 * to avoid React hydration mismatch errors.
 */
const dustParticles: DustParticle[] = [
  {
    id: 0,
    left: 6.2,
    top: 31.4,
    size: 5,
    delay: 0.2,
    duration: 4.2,
    opacity: 0.42,
    type: "orange",
  },
  {
    id: 1,
    left: 12.8,
    top: 48.7,
    size: 8,
    delay: 1.1,
    duration: 5.1,
    opacity: 0.32,
    type: "gold",
  },
  {
    id: 2,
    left: 18.4,
    top: 66.2,
    size: 4,
    delay: 0.7,
    duration: 3.8,
    opacity: 0.5,
    type: "yellow",
  },
  {
    id: 3,
    left: 24.7,
    top: 28.5,
    size: 7,
    delay: 1.5,
    duration: 4.7,
    opacity: 0.36,
    type: "orange",
  },
  {
    id: 4,
    left: 30.1,
    top: 57.8,
    size: 5,
    delay: 0.4,
    duration: 5.4,
    opacity: 0.44,
    type: "gold",
  },
  {
    id: 5,
    left: 36.8,
    top: 42.3,
    size: 9,
    delay: 1.8,
    duration: 4.1,
    opacity: 0.28,
    type: "yellow",
  },
  {
    id: 6,
    left: 42.5,
    top: 72.4,
    size: 4,
    delay: 0.9,
    duration: 3.6,
    opacity: 0.48,
    type: "orange",
  },
  {
    id: 7,
    left: 48.9,
    top: 35.6,
    size: 6,
    delay: 1.3,
    duration: 4.9,
    opacity: 0.38,
    type: "gold",
  },
  {
    id: 8,
    left: 54.2,
    top: 61.7,
    size: 8,
    delay: 0.5,
    duration: 5.2,
    opacity: 0.3,
    type: "yellow",
  },
  {
    id: 9,
    left: 59.6,
    top: 25.9,
    size: 5,
    delay: 1.7,
    duration: 4,
    opacity: 0.46,
    type: "orange",
  },
  {
    id: 10,
    left: 64.3,
    top: 50.8,
    size: 7,
    delay: 0.3,
    duration: 4.6,
    opacity: 0.34,
    type: "gold",
  },
  {
    id: 11,
    left: 69.8,
    top: 70.2,
    size: 4,
    delay: 1,
    duration: 3.9,
    opacity: 0.5,
    type: "yellow",
  },
  {
    id: 12,
    left: 75.4,
    top: 39.5,
    size: 9,
    delay: 1.6,
    duration: 5.3,
    opacity: 0.27,
    type: "orange",
  },
  {
    id: 13,
    left: 81.2,
    top: 58.6,
    size: 6,
    delay: 0.6,
    duration: 4.4,
    opacity: 0.41,
    type: "gold",
  },
  {
    id: 14,
    left: 87.6,
    top: 32.7,
    size: 5,
    delay: 1.2,
    duration: 3.7,
    opacity: 0.45,
    type: "yellow",
  },
  {
    id: 15,
    left: 93.1,
    top: 67.8,
    size: 8,
    delay: 0.8,
    duration: 5,
    opacity: 0.31,
    type: "orange",
  },
  {
    id: 16,
    left: 8.7,
    top: 75.1,
    size: 6,
    delay: 1.4,
    duration: 4.3,
    opacity: 0.37,
    type: "gold",
  },
  {
    id: 17,
    left: 15.9,
    top: 38.2,
    size: 4,
    delay: 0.1,
    duration: 3.5,
    opacity: 0.49,
    type: "yellow",
  },
  {
    id: 18,
    left: 21.5,
    top: 53.4,
    size: 7,
    delay: 1.9,
    duration: 5.5,
    opacity: 0.29,
    type: "orange",
  },
  {
    id: 19,
    left: 27.3,
    top: 76.6,
    size: 5,
    delay: 0.7,
    duration: 4.8,
    opacity: 0.43,
    type: "gold",
  },
  {
    id: 20,
    left: 33.6,
    top: 33.1,
    size: 8,
    delay: 1.1,
    duration: 4.2,
    opacity: 0.33,
    type: "yellow",
  },
  {
    id: 21,
    left: 39.4,
    top: 55.9,
    size: 5,
    delay: 0.5,
    duration: 3.9,
    opacity: 0.47,
    type: "orange",
  },
  {
    id: 22,
    left: 45.7,
    top: 79.3,
    size: 7,
    delay: 1.5,
    duration: 5.1,
    opacity: 0.3,
    type: "gold",
  },
  {
    id: 23,
    left: 51.8,
    top: 46.7,
    size: 4,
    delay: 0.2,
    duration: 3.8,
    opacity: 0.51,
    type: "yellow",
  },
  {
    id: 24,
    left: 57.3,
    top: 68.9,
    size: 8,
    delay: 1.7,
    duration: 4.6,
    opacity: 0.35,
    type: "orange",
  },
  {
    id: 25,
    left: 63.7,
    top: 30.4,
    size: 6,
    delay: 0.9,
    duration: 5.2,
    opacity: 0.4,
    type: "gold",
  },
  {
    id: 26,
    left: 70.1,
    top: 53.8,
    size: 5,
    delay: 1.3,
    duration: 4.1,
    opacity: 0.45,
    type: "yellow",
  },
  {
    id: 27,
    left: 76.8,
    top: 74.5,
    size: 9,
    delay: 0.4,
    duration: 5.4,
    opacity: 0.26,
    type: "orange",
  },
  {
    id: 28,
    left: 83.5,
    top: 43.1,
    size: 4,
    delay: 1.8,
    duration: 3.6,
    opacity: 0.5,
    type: "gold",
  },
  {
    id: 29,
    left: 89.7,
    top: 61.2,
    size: 7,
    delay: 0.6,
    duration: 4.7,
    opacity: 0.34,
    type: "yellow",
  },
  {
    id: 30,
    left: 96.2,
    top: 36.8,
    size: 5,
    delay: 1,
    duration: 4.3,
    opacity: 0.42,
    type: "orange",
  },
  {
    id: 31,
    left: 4.3,
    top: 55.2,
    size: 8,
    delay: 1.6,
    duration: 5,
    opacity: 0.3,
    type: "gold",
  },
  {
    id: 32,
    left: 11.6,
    top: 69.4,
    size: 4,
    delay: 0.3,
    duration: 3.7,
    opacity: 0.48,
    type: "yellow",
  },
  {
    id: 33,
    left: 17.2,
    top: 26.7,
    size: 6,
    delay: 1.2,
    duration: 4.5,
    opacity: 0.39,
    type: "orange",
  },
  {
    id: 34,
    left: 23.8,
    top: 44.9,
    size: 9,
    delay: 0.8,
    duration: 5.3,
    opacity: 0.27,
    type: "gold",
  },
  {
    id: 35,
    left: 29.6,
    top: 64.1,
    size: 5,
    delay: 1.4,
    duration: 4,
    opacity: 0.46,
    type: "yellow",
  },
  {
    id: 36,
    left: 35.2,
    top: 22.8,
    size: 7,
    delay: 0.5,
    duration: 4.9,
    opacity: 0.32,
    type: "orange",
  },
  {
    id: 37,
    left: 41.9,
    top: 48.3,
    size: 4,
    delay: 1.9,
    duration: 3.8,
    opacity: 0.5,
    type: "gold",
  },
  {
    id: 38,
    left: 47.4,
    top: 63.7,
    size: 8,
    delay: 0.7,
    duration: 5.1,
    opacity: 0.29,
    type: "yellow",
  },
  {
    id: 39,
    left: 53.6,
    top: 29.5,
    size: 5,
    delay: 1.1,
    duration: 4.4,
    opacity: 0.44,
    type: "orange",
  },
  {
    id: 40,
    left: 60.8,
    top: 76.2,
    size: 7,
    delay: 0.2,
    duration: 5.2,
    opacity: 0.33,
    type: "gold",
  },
  {
    id: 41,
    left: 66.4,
    top: 41.6,
    size: 4,
    delay: 1.5,
    duration: 3.9,
    opacity: 0.49,
    type: "yellow",
  },
  {
    id: 42,
    left: 72.7,
    top: 57.4,
    size: 8,
    delay: 0.9,
    duration: 4.8,
    opacity: 0.31,
    type: "orange",
  },
  {
    id: 43,
    left: 78.9,
    top: 27.6,
    size: 6,
    delay: 1.7,
    duration: 4.2,
    opacity: 0.4,
    type: "gold",
  },
  {
    id: 44,
    left: 85.3,
    top: 70.8,
    size: 5,
    delay: 0.4,
    duration: 5.4,
    opacity: 0.43,
    type: "yellow",
  },
  {
    id: 45,
    left: 91.8,
    top: 49.7,
    size: 9,
    delay: 1.3,
    duration: 4.6,
    opacity: 0.25,
    type: "orange",
  },
  {
    id: 46,
    left: 97.1,
    top: 78.1,
    size: 4,
    delay: 0.6,
    duration: 3.7,
    opacity: 0.51,
    type: "gold",
  },
  {
    id: 47,
    left: 3.1,
    top: 41.9,
    size: 6,
    delay: 1.8,
    duration: 4.3,
    opacity: 0.38,
    type: "yellow",
  },
  {
    id: 48,
    left: 14.4,
    top: 59.8,
    size: 8,
    delay: 0.1,
    duration: 5,
    opacity: 0.3,
    type: "orange",
  },
  {
    id: 49,
    left: 26.2,
    top: 36.4,
    size: 5,
    delay: 1,
    duration: 4.7,
    opacity: 0.45,
    type: "gold",
  },
  {
    id: 50,
    left: 38.7,
    top: 69.6,
    size: 7,
    delay: 0.8,
    duration: 5.3,
    opacity: 0.32,
    type: "yellow",
  },
  {
    id: 51,
    left: 50.3,
    top: 53.1,
    size: 4,
    delay: 1.4,
    duration: 3.9,
    opacity: 0.5,
    type: "orange",
  },
  {
    id: 52,
    left: 62.9,
    top: 38.7,
    size: 8,
    delay: 0.5,
    duration: 4.4,
    opacity: 0.28,
    type: "gold",
  },
  {
    id: 53,
    left: 74.5,
    top: 65.3,
    size: 5,
    delay: 1.6,
    duration: 5.1,
    opacity: 0.43,
    type: "yellow",
  },
  {
    id: 54,
    left: 88.4,
    top: 54.6,
    size: 6,
    delay: 0.3,
    duration: 4.1,
    opacity: 0.36,
    type: "orange",
  },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [ganesha, setGanesha] = useState<Ganesha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<Ganesha | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dustActive, setDustActive] = useState(false);

  /*
   * Detect when Gallery enters viewport.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setDustActive(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /*
   * Stop the stronger dust animation after
   * the reveal has completed.
   */
  useEffect(() => {
    if (!dustActive) return;

    const timer = window.setTimeout(() => {
      setDustActive(false);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [dustActive]);

  /*
   * Load Ganesha gallery.
   */
  useEffect(() => {
    async function loadGanesha() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/ganesha", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load Ganesha gallery."
          );
        }

        setGanesha(data.data || []);
      } catch (error) {
        console.error("Gallery loading error:", error);
        setError("Unable to load the Ganesha gallery.");
      } finally {
        setLoading(false);
      }
    }

    loadGanesha();
  }, []);

  /*
   * Group images by year.
   */
  const groupedByYear = useMemo(() => {
    const groups: Record<number, Ganesha[]> = {};

    for (const item of ganesha) {
      if (!groups[item.year]) {
        groups[item.year] = [];
      }

      groups[item.year].push(item);
    }

    return Object.entries(groups)
      .map(([year, images]) => ({
        year: Number(year),
        images,
      }))
      .sort((a, b) => b.year - a.year);
  }, [ganesha]);

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        className="relative overflow-hidden bg-[#FFFDF5] py-24 sm:py-28"
      >
        {/* =================================================
            BACKGROUND GLOW
        ================================================= */}

        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#F97316]/10 blur-[100px]" />

        <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-[#FBBF24]/10 blur-[100px]" />

        {/* =================================================
            DEVOTIONAL DUST
        ================================================= */}

        <div
          className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-1000 ${
            dustActive ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Large soft dust clouds */}

          <div className="gallery-dust-cloud gallery-dust-orange absolute -left-32 top-[35%] h-56 w-56 rounded-full bg-[#F97316]/20 blur-[70px]" />

          <div className="gallery-dust-cloud gallery-dust-gold absolute left-[25%] top-[20%] h-64 w-64 rounded-full bg-[#FBBF24]/20 blur-[80px]" />

          <div className="gallery-dust-cloud gallery-dust-yellow absolute right-[20%] top-[40%] h-72 w-72 rounded-full bg-[#FDE047]/20 blur-[90px]" />

          <div className="gallery-dust-cloud gallery-dust-orange absolute -right-32 bottom-[20%] h-64 w-64 rounded-full bg-[#EA580C]/15 blur-[80px]" />

          {/* Fine particles */}

          {dustParticles.map((particle) => (
            <span
              key={particle.id}
              className={`gallery-dust-particle absolute rounded-full ${
                particle.type === "orange"
                  ? "bg-[#F97316]"
                  : particle.type === "gold"
                    ? "bg-[#FBBF24]"
                    : "bg-[#FDE047]"
              }`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="relative z-20 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* =================================================
              HEADING
          ================================================= */}

          <div
            className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/40 bg-[#FFF3C4] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">
              <MdAutoAwesome size={16} />
              Our Memories
            </div>

            <h2 className="text-4xl font-black tracking-tight text-[#292524] sm:text-5xl">
              Ganesha{" "}
              <span className="bg-gradient-to-r from-[#EA580C] via-[#FBBF24] to-[#EA580C] bg-clip-text text-transparent">
                Gallery
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#57534E] sm:text-base">
              A collection of beautiful memories, celebrations, and divine
              moments from the journey of Hindustan Yuva Vrindha.
            </p>

            {/* Decorative divider */}

            <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#F97316]" />
              <span className="h-2.5 w-2.5 rotate-45 bg-[#FBBF24]" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F97316]" />
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-6 py-4 shadow-sm">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FBBF24] border-t-[#EA580C]" />

                <span className="text-sm font-semibold text-[#57534E]">
                  Loading gallery...
                </span>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading && !error && groupedByYear.length === 0 && (
            <div className="mx-auto mt-16 max-w-lg rounded-3xl border border-orange-100 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3C4]">
                <MdImage size={30} className="text-[#EA580C]" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#292524]">
                Gallery Coming Soon
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                Ganesha celebration memories will appear here soon.
              </p>
            </div>
          )}

          {/* =================================================
              YEARS
          ================================================= */}

          {!loading && !error && groupedByYear.length > 0 && (
            <div className="mt-16 space-y-20">
              {groupedByYear.map(({ year, images }, yearIndex) => (
                <div
                  key={year}
                  className={`transition-all duration-1000 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-16 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isVisible
                      ? `${yearIndex * 250 + 300}ms`
                      : "0ms",
                  }}
                >
                  {/* =================================
                      YEAR HEADER
                  ================================= */}

                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EA580C] text-white shadow-lg shadow-orange-200">
                      <MdCalendarMonth size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EA580C]">
                        Ganeshotsav
                      </p>

                      <h3 className="text-3xl font-black text-[#292524]">
                        {year}
                      </h3>
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-r from-[#FBBF24] via-orange-200 to-transparent" />

                    <div className="hidden rounded-full bg-[#FFF3C4] px-4 py-2 text-xs font-bold text-[#8B5E00] sm:block">
                      {images.length}{" "}
                      {images.length === 1 ? "Memory" : "Memories"}
                    </div>
                  </div>

                  {/* =================================
                      IMAGE CARDS
                  ================================= */}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedImage(item)}
                        className={`group relative overflow-hidden rounded-3xl border border-orange-100 bg-white text-left shadow-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100 ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                        }`}
                        style={{
                          transitionDelay: isVisible
                            ? `${
                                yearIndex * 250 +
                                index * 120 +
                                500
                              }ms`
                            : "0ms",
                        }}
                      >
                        {/* Image */}

                        <div className="relative aspect-[4/3] overflow-hidden bg-[#FEF3C7]">
                          <img
                            src={item.imageUrl}
                            alt={item.title || `Ganesha ${year}`}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />

                          {/* Warm image overlay */}

                          <div className="absolute inset-0 bg-gradient-to-t from-[#3B2415]/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                          {/* Number */}

                          <div className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full bg-white/90 px-2 text-xs font-black text-[#EA580C] shadow-md backdrop-blur">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          {/* View */}

                          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="inline-flex rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#3B2415] shadow-lg">
                              View Image
                            </span>
                          </div>
                        </div>

                        {/* Card content */}

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                                {year}
                              </p>

                              <h4 className="mt-1 line-clamp-2 text-base font-bold text-[#292524]">
                                {item.title}
                              </h4>
                            </div>

                            <MdAutoAwesome
                              size={20}
                              className="shrink-0 text-[#FBBF24]"
                            />
                          </div>

                          {item.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#78716C]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          IMAGE MODAL
      =================================================== */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
              aria-label="Close image"
            >
              <MdClose size={25} />
            </button>

            <div className="flex max-h-[78vh] items-center justify-center bg-black">
              <img
                src={selectedImage.imageUrl}
                alt={
                  selectedImage.title ||
                  `Ganesha ${selectedImage.year}`
                }
                className="max-h-[78vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="bg-white px-5 py-4 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Ganeshotsav {selectedImage.year}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#292524]">
                    {selectedImage.title}
                  </h3>
                </div>

                <div className="hidden shrink-0 items-center gap-1 rounded-full bg-[#FFF3C4] px-3 py-2 text-xs font-bold text-[#8B5E00] sm:flex">
                  <MdAutoAwesome size={14} />
                  Divine Memory
                </div>
              </div>

              {selectedImage.description && (
                <p className="mt-2 text-sm leading-6 text-[#78716C]">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}