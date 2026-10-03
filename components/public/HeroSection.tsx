"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MdArrowForward,
  MdAutoAwesome,
} from "react-icons/md";
import { GrInstagram } from "react-icons/gr";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FFFDF5]">
      {/* =========================================================
          BACKGROUND GLOW
      ========================================================== */}

      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#F97316]/10 blur-3xl" />

      <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-[#FBBF24]/15 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EA580C]/5 blur-3xl" />

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          px-5
          pb-16
          pt-28
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-10
            lg:grid-cols-[0.95fr_1.05fr]
            lg:gap-8
          "
        >
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <div className="relative z-20 min-w-0 max-w-2xl">
            {/* DEVOTIONAL BADGE */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#F97316]/20
                bg-[#FFF7ED]
                px-5
                py-2.5
                shadow-sm
              "
            >
              <span
                className="
                  text-sm
                  font-semibold
                  tracking-wide
                  text-[#EA580C]
                  sm:text-base
                "
              >
                ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ
              </span>
            </div>

            {/* MAIN HERO HEADING */}

            <h1
              className="
                relative
                z-20
                max-w-full
                overflow-visible
                text-[42px]
                font-extrabold
                leading-[1.02]
                tracking-[-0.035em]
                sm:text-[48px]
                md:text-[52px]
                lg:text-[54px]
                xl:text-[60px]
              "
            >
              <span
                className="
                  inline-block
                  max-w-full
                  bg-[linear-gradient(110deg,#B93805_0%,#EA580C_18%,#F97316_32%,#FBBF24_46%,#FFE98A_50%,#FBBF24_54%,#F97316_68%,#EA580C_82%,#B93805_100%)]
                  bg-[length:220%_100%]
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_3px_10px_rgba(234,88,12,0.28)]
                  animate-[fireGradient_7s_ease-in-out_infinite]
                "
              >
                Hindustan Yuva Vrindha
              </span>
            </h1>

            {/* SECONDARY HEADING */}

            <h2
              className="
                mt-6
                max-w-xl
                text-2xl
                font-bold
                leading-[1.35]
                text-[#3B2415]
                sm:text-3xl
              "
            >
              A Journey of Faith,
              <br />
              Service, Culture &amp; Togetherness
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-xl
                text-lg
                leading-8
                text-[#57534E]
                sm:text-xl
              "
            >
              Rooted in tradition, united by faith, and inspired by
              the timeless values of Sanatana Dharma.
            </p>

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-7
                text-[#78716C]
              "
            >
              We bring together devotion, service, culture, and
              community while empowering the youth to preserve our
              heritage and carry its values forward.
            </p>

            {/* CTA BUTTONS */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {/* Explore */}

              <Link
                href="#about"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#EA580C]
                  px-7
                  py-3.5
                  font-semibold
                  text-white
                  shadow-md
                  shadow-[#EA580C]/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#C2410C]
                  hover:shadow-lg
                "
              >
                Explore Our Journey

                <MdArrowForward
                  size={20}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              {/* Instagram */}

              <a
                href="https://www.instagram.com/hindustan_yuva_vrunda/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border-2
                  border-[#EA580C]/30
                  bg-white
                  px-7
                  py-3.5
                  font-semibold
                  text-[#EA580C]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#EA580C]
                  hover:bg-[#FFF7ED]
                "
              >
                <GrInstagram
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                Join Our Community
              </a>
            </div>
          </div>

          {/* =====================================================
              RIGHT GANESHA SECTION
          ====================================================== */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[430px]
              items-center
              justify-center
              overflow-visible
              sm:min-h-[500px]
              lg:min-h-[620px]
            "
          >
            {/* CENTRAL AURA */}

            <div
              className="
                absolute
                h-[270px]
                w-[270px]
                rounded-full
                bg-[#FBBF24]/20
                blur-[45px]
                animate-[softPulse_5s_ease-in-out_infinite]
                sm:h-[400px]
                sm:w-[400px]
                lg:h-[500px]
                lg:w-[500px]
              "
            />

            {/* =================================================
                OUTER RING
            ================================================== */}

            <div
              className="
                absolute
                h-[350px]
                w-[350px]
                rounded-full
                border-2
                border-[#FBBF24]/60
                animate-[spin_18s_linear_infinite]
                sm:h-[480px]
                sm:w-[480px]
                lg:h-[550px]
                lg:w-[550px]
              "
            >
              <span
                className="
                  absolute
                  -top-1.5
                  left-1/2
                  h-3
                  w-3
                  -translate-x-1/2
                  rounded-full
                  bg-[#FBBF24]
                  shadow-[0_0_18px_6px_rgba(251,191,36,0.65)]
                "
              />

              <span
                className="
                  absolute
                  right-[12%]
                  top-[18%]
                  h-2
                  w-2
                  rounded-full
                  bg-[#EA580C]
                  shadow-[0_0_15px_5px_rgba(234,88,12,0.5)]
                "
              />

              <span
                className="
                  absolute
                  bottom-[14%]
                  left-[20%]
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-[#FBBF24]
                  shadow-[0_0_18px_5px_rgba(251,191,36,0.55)]
                "
              />
            </div>

            {/* =================================================
                INNER RING
            ================================================== */}

            <div
              className="
                absolute
                h-[295px]
                w-[295px]
                rounded-full
                border-2
                border-dashed
                border-[#EA580C]/45
                animate-[spin_12s_linear_infinite_reverse]
                sm:h-[410px]
                sm:w-[410px]
                lg:h-[465px]
                lg:w-[465px]
              "
            >
              <span
                className="
                  absolute
                  bottom-[4%]
                  left-1/2
                  h-2.5
                  w-2.5
                  -translate-x-1/2
                  rounded-full
                  bg-[#EA580C]
                  shadow-[0_0_18px_6px_rgba(234,88,12,0.5)]
                "
              />

              <span
                className="
                  absolute
                  left-[7%]
                  top-[30%]
                  h-2
                  w-2
                  rounded-full
                  bg-[#FBBF24]
                  shadow-[0_0_15px_5px_rgba(251,191,36,0.55)]
                "
              />

              <span
                className="
                  absolute
                  bottom-[30%]
                  right-[8%]
                  h-2
                  w-2
                  rounded-full
                  bg-[#2563EB]
                  shadow-[0_0_15px_5px_rgba(37,99,235,0.35)]
                "
              />
            </div>

            {/* =================================================
                ORBITING SPARKLES
            ================================================== */}

            <div
              className="
                absolute
                h-[330px]
                w-[330px]
                animate-[spin_20s_linear_infinite]
                sm:h-[450px]
                sm:w-[450px]
                lg:h-[520px]
                lg:w-[520px]
              "
            >
              <MdAutoAwesome
                size={22}
                className="
                  absolute
                  left-[8%]
                  top-[15%]
                  text-[#FBBF24]
                  animate-[sparkle_2.2s_ease-in-out_infinite]
                "
              />

              <MdAutoAwesome
                size={17}
                className="
                  absolute
                  right-[8%]
                  top-[27%]
                  text-[#EA580C]
                  animate-[sparkle_2.8s_ease-in-out_infinite]
                "
              />

              <MdAutoAwesome
                size={19}
                className="
                  absolute
                  bottom-[15%]
                  left-[25%]
                  text-[#FBBF24]
                  animate-[sparkle_2.5s_ease-in-out_infinite]
                "
              />

              <MdAutoAwesome
                size={15}
                className="
                  absolute
                  bottom-[18%]
                  right-[20%]
                  text-[#2563EB]
                  animate-[sparkle_3s_ease-in-out_infinite]
                "
              />
            </div>

            {/* =================================================
                GANESHA
                STATIC IMAGE
            ================================================== */}

            <div
              className="
                relative
                z-30
                flex
                h-[290px]
                w-[290px]
                items-center
                justify-center
                sm:h-[370px]
                sm:w-[370px]
                lg:h-[430px]
                lg:w-[430px]
              "
            >
              {/* Ganesha glow */}

              <div
                className="
                  absolute
                  inset-[12%]
                  rounded-full
                  bg-[#FBBF24]/20
                  blur-[45px]
                "
              />

              {/* Ganesha Image */}

              <Image
                src="/images/hero.png"
                alt="Lord Ganesha"
                width={400}
                height={400}
                priority
                quality={75}
                sizes="(max-width: 639px) 260px, (max-width: 1023px) 340px, 400px"
                className="
                  relative
                  z-40
                  block
                  h-auto
                  w-auto
                  max-h-[260px]
                  max-w-[260px]
                  object-contain
                  drop-shadow-[0_14px_22px_rgba(59,36,21,0.25)]
                  transition-transform
                  duration-500
                  hover:scale-[1.02]
                  sm:max-h-[340px]
                  sm:max-w-[340px]
                  lg:max-h-[400px]
                  lg:max-w-[400px]
                "
              />
            </div>

            {/* =================================================
                SMALL GLITTER DOTS
            ================================================== */}

            <span
              className="
                absolute
                left-[14%]
                top-[32%]
                h-2
                w-2
                rounded-full
                bg-[#FBBF24]
                shadow-[0_0_14px_4px_rgba(251,191,36,0.5)]
                animate-[sparkle_2.4s_ease-in-out_infinite]
              "
            />

            <span
              className="
                absolute
                right-[13%]
                top-[40%]
                h-1.5
                w-1.5
                rounded-full
                bg-[#EA580C]
                shadow-[0_0_12px_4px_rgba(234,88,12,0.45)]
                animate-[sparkle_2.8s_ease-in-out_infinite]
              "
            />

            <span
              className="
                absolute
                bottom-[24%]
                left-[18%]
                h-1.5
                w-1.5
                rounded-full
                bg-[#FBBF24]
                shadow-[0_0_12px_4px_rgba(251,191,36,0.45)]
                animate-[sparkle_3s_ease-in-out_infinite]
              "
            />
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM GRADIENT
      ========================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-1
          bg-gradient-to-r
          from-[#F97316]
          via-[#FBBF24]
          to-[#2563EB]
        "
      />
    </section>
  );
}