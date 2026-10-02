import { MdLocationOn, MdArrowForward } from "react-icons/md";
import { FaInstagram } from "react-icons/fa6";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#FFFDF5] py-24 sm:py-28"
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F97316]/8 blur-3xl" />

      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#2563EB]/8 blur-3xl" />

      <div className="absolute right-1/4 top-10 h-32 w-32 rounded-full bg-[#FBBF24]/10 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EA580C]/20 bg-[#FFF7ED] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#EA580C]" />

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#EA580C]">
              Connect With Us
            </p>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#292524] sm:text-4xl lg:text-5xl">
            Be Part of Our{" "}
            <span className="text-[#EA580C]">Journey</span>
          </h2>

          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#EA580C]" />
            <span className="h-1 w-6 rounded-full bg-[#FBBF24]" />
            <span className="h-1 w-3 rounded-full bg-[#2563EB]" />
          </div>

          <p className="mt-7 text-base leading-8 text-[#57534E] sm:text-lg">
            Be a part of the devotion, tradition, and togetherness
            of Hindustan Yuva Vrindha.
          </p>

          <p className="mt-4 text-base leading-8 text-[#78716C] sm:text-lg">
            Whether you wish to participate in our{" "}
            <strong className="font-semibold text-[#EA580C]">
              Ganeshotsav celebrations
            </strong>
            , volunteer for Seva, support our activities, or simply
            connect with our community, we would be happy to hear from you.
          </p>

          <p className="mt-5 font-semibold text-[#2563EB]">
            Join us in keeping the spirit of devotion alive.
          </p>
        </div>

        {/* ================= LOCATION / INSTAGRAM ================= */}

        <div className="relative mt-16 overflow-hidden rounded-3xl border border-[#FBBF24]/30 bg-white p-8 shadow-sm sm:p-10">
          {/* Gradient side accent */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#EA580C] via-[#FBBF24] to-[#2563EB]" />

          <div className="relative flex flex-col items-center text-center">
            {/* Decorative icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7ED]">
              <span className="text-2xl">🙏</span>
            </div>

            {/* Quote */}
            <p className="mt-6 text-xl font-semibold italic text-[#3B2415] sm:text-2xl">
              “Together in Faith. United in Devotion.”
            </p>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C]">
              Let us come together to celebrate tradition, serve our
              community, and keep the spirit of Ganeshotsav alive.
            </p>

            {/* ================= TWO BUTTONS ================= */}

            <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              {/* Locate Us */}
              <a
                href="https://maps.app.goo.gl/AY7wjUMLCE8UmsK1A"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#EA580C] px-7 py-3.5 font-semibold text-white shadow-md shadow-[#EA580C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2410C] hover:shadow-lg"
              >
                <MdLocationOn size={20} />

                Locate Us

                <MdArrowForward
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              {/* Join Us */}
              <a
                href="https://www.instagram.com/hindustan_yuva_vrunda/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#2563EB]/30 bg-white px-7 py-3.5 font-semibold text-[#2563EB] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2563EB] hover:bg-[#EFF6FF]"
              >
                <FaInstagram
                  size={19}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                Join Us

                <MdArrowForward
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM MESSAGE ================= */}

        <div className="mt-12 flex items-center justify-center gap-3 text-center">
          <div className="h-px w-12 bg-[#FBBF24]" />

          <span className="text-sm font-medium text-[#78716C]">
            Bhakti • Seva • Sanskriti • Samarpan
          </span>

          <div className="h-px w-12 bg-[#FBBF24]" />
        </div>
      </div>
    </section>
  );
}
