"use client";

import { useEffect, useRef, useState } from "react";
import { MdAutoAwesome, MdHandshake } from "react-icons/md";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const target = 37;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#FFFDF5]
        py-16
        sm:py-20
        md:py-24
        lg:py-28
      "
    >
      {/* Background Decoration */}

      <div
        className="
          absolute
          -left-32
          top-20
          h-64
          w-64
          rounded-full
          bg-[#F97316]/7
          blur-3xl
          sm:-left-40
          sm:h-80
          sm:w-80
        "
      />

      <div
        className="
          absolute
          -right-32
          bottom-10
          h-72
          w-72
          rounded-full
          bg-[#2563EB]/6
          blur-3xl
          sm:-right-40
          sm:h-96
          sm:w-96
        "
      />

      <div
        className="
          absolute
          right-1/4
          top-20
          hidden
          h-32
          w-32
          rounded-full
          bg-[#FBBF24]/10
          blur-3xl
          sm:block
        "
      />

      {/* Main Container */}
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          md:px-8
          lg:px-10
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-10
            sm:gap-12
            md:gap-14
            lg:grid-cols-[0.8fr_1.2fr]
            lg:gap-16
            xl:gap-20
          "
        >
          {/* Years Counter */}
          <div
            className="
              relative
              flex
              w-full
              justify-center
              lg:justify-start
            "
          >
            {/* Main Counter Circle */}
            <div
              className="
                relative
                flex
                aspect-square
                w-[min(72vw,260px)]
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-[#EA580C]
                via-[#F97316]
                to-[#C2410C]
                shadow-2xl
                shadow-[#EA580C]/20
                sm:w-[min(58vw,340px)]
                lg:w-[min(34vw,340px)]
                xl:w-[340px]
              "
            >
              {/* Inner Circle */}
              <div
                className="
                  flex
                  aspect-square
                  w-[84%]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#EA580C]
                "
              >
                <div className="w-full px-3 text-center sm:px-4">
                  {/* Small Icon */}
                  <div
                    className="
                      relative
                      mx-auto
                      mb-2
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      sm:mb-3
                      sm:h-10
                      sm:w-10
                    "
                  >
                    <MdAutoAwesome
                      className="
                        relative
                        z-10
                        text-[#FBBF24]
                        drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]
                        animate-[sparkleGlitter_1.8s_ease-in-out_infinite]
                      "
                      size={28}
                    />
                  </div>

                  {/* Animated Counter */}
                  <div className="flex items-center justify-center">
                    <span
                      className="
                        text-5xl
                        font-extrabold
                        tracking-tight
                        text-[#FFFDF5]
                        min-[375px]:text-6xl
                        sm:text-7xl
                        md:text-8xl
                      "
                    >
                      {count}
                    </span>

                    <span
                      className="
                        ml-0.5
                        text-3xl
                        font-bold
                        text-[#FBBF24]
                        min-[375px]:text-4xl
                        sm:text-5xl
                        md:text-6xl
                      "
                    >
                      +
                    </span>
                  </div>

                  {/* Counter Label */}
                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#FFF3C4]
                      min-[375px]:text-[10px]
                      sm:mt-2
                      sm:text-xs
                      sm:tracking-[0.25em]
                      md:text-sm
                    "
                  >
                    Years of Devotion
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full min-w-0">
            {/* Label */}
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#EA580C]
                  sm:text-sm
                  sm:tracking-[0.25em]
                "
              >
                Our Journey
              </p>
            </div>

            {/* Heading */}
            <h2
              className="
                max-w-full
                text-2xl
                font-bold
                leading-tight
                tracking-tight
                min-[375px]:text-3xl
                sm:text-4xl
                lg:text-5xl
              "
            >
              <span className="text-[#292524]">
                About{" "}
              </span>

              <span
                className="
                  bg-gradient-to-r
                  from-[#A16207]
                  via-[#FBBF24]
                  to-[#D97706]
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_2px_6px_rgba(251,191,36,0.25)]
                "
              >
                Hindustan Yuva Vrindha
              </span>
            </h2>

            {/* Divider */}
            <div
              className="
                my-5
                flex
                w-full
                max-w-full
                items-center
                gap-1.5
                sm:my-7
                sm:gap-2
              "
            >
              <div className="h-1 w-[30%] max-w-50 rounded-full bg-[#EA580C]" />
              <div className="h-1 w-[24%] max-w-40 rounded-full bg-[#FBBF24]" />
              <div className="h-1 w-[18%] max-w-30 rounded-full bg-[#2563EB]" />
            </div>

            {/* Content */}
            <div
              className="
                mt-4
                space-y-4
                text-sm
                leading-7
                text-[#57534E]
                sm:mt-5
                sm:space-y-5
                sm:text-base
                sm:leading-8
                md:text-lg
              "
            >
              <p>
                For over{" "}
                <strong className="text-xl font-bold text-[#EA580C] sm:text-2xl">
                  37 years
                </strong>
                , Hindustan Yuva Vrindha has been devoted to
                celebrating and worshipping{" "}
                <strong className="font-semibold text-[#3B2415]">
                  Lord Ganesha
                </strong>{" "}
                with faith, tradition, and unity.
              </p>

              <p>
                What began as a humble spiritual gathering has
                grown into a cherished community rooted in
                devotion and cultural values. Through the years,
                generations have come together to seek the
                blessings of Lord Ganesha and celebrate the
                spirit of togetherness.
              </p>

              <p>
                Our journey is built on{" "}
                <strong className="font-semibold text-[#EA580C]">
                  Bhakti, Seva, Sanskriti, and Samarpan.
                </strong>
              </p>

              <p>
                As we move forward, we remain committed to
                preserving our traditions and passing the divine
                spirit of Ganeshotsav to future generations.
              </p>

              <p className="font-semibold text-[#3B2415]">
                For 37 years and counting, our faith continues
                to grow, our community continues to unite, and
                our devotion to Lord Ganesha continues to shine.
              </p>
            </div>

            {/* Values */}
            <div className="mt-6 flex w-full flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <ValueBadge label="Bhakti" color="orange" />
              <ValueBadge label="Seva" color="blue" />
              <ValueBadge label="Sanskriti" color="gold" />
              <ValueBadge label="Samarpan" color="orange" />
            </div>

            {/* Bottom Message */}
            <div
              className="
                mt-6
                flex
                w-full
                items-start
                gap-3
                rounded-xl
                border
                border-[#FBBF24]/30
                bg-[#FFFBEB]
                px-3
                py-3
                sm:mt-8
                sm:px-5
                sm:py-4
              "
            >
              <MdHandshake
                size={23}
                className="mt-0.5 shrink-0 text-[#EA580C] sm:size-[25px]"
              />

              <span
                className="
                  min-w-0
                  text-xs
                  font-semibold
                  leading-5
                  text-[#57534E]
                  sm:text-sm
                  sm:leading-6
                "
              >
                Together, we preserve our traditions and
                celebrate the divine spirit of Ganeshotsav.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================
   VALUE BADGE
================================================= */

function ValueBadge({
  label,
  color,
}: {
  label: string;
  color: "orange" | "blue" | "gold";
}) {
  const styles = {
    orange: {
      wrapper: "border-[#EA580C]/20 bg-[#FFF7ED]",
      text: "text-[#C2410C]",
      dot: "bg-[#EA580C]",
    },

    blue: {
      wrapper: "border-[#2563EB]/20 bg-[#EFF6FF]",
      text: "text-[#1D4ED8]",
      dot: "bg-[#2563EB]",
    },

    gold: {
      wrapper: "border-[#FBBF24]/30 bg-[#FFFBEB]",
      text: "text-[#A16207]",
      dot: "bg-[#FBBF24]",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`
        inline-flex
        max-w-full
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        sm:px-4
        sm:py-2
        sm:text-sm
        ${style.wrapper}
        ${style.text}
      `}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
      />

      <span className="truncate">
        {label}
      </span>
    </div>
  );
}