"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import {
  MdArrowForward,
  MdAutoAwesome,
  MdEmail,
  MdLock,
  MdLogin,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show / hide password
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // --------------------------------
    // Frontend validation
    // --------------------------------

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // --------------------------------
      // Existing Login API
      // --------------------------------

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      // --------------------------------
      // API Error
      // --------------------------------

      if (!response.ok) {
        setError(data.message || "Unable to login.");
        return;
      }

      // --------------------------------
      // Login Success
      // --------------------------------

      setSuccess(
        data.message || "Login successful. Redirecting..."
      );

      // Give the success message a moment
      // before redirecting.
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);
    } catch (error) {
      console.error("Login request error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFFDF5] px-5 py-12 sm:px-8">
      {/* =====================================================
          HOLI SMOKE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orange smoke */}
        <div
          className="
            absolute
            -left-40
            top-0
            h-96
            w-96
            rounded-full
            bg-[#F97316]/25
            blur-[110px]
            animate-[holiSmokeOne_12s_ease-in-out_infinite]
          "
        />

        {/* Blue smoke */}
        <div
          className="
            absolute
            -right-40
            top-10
            h-96
            w-96
            rounded-full
            bg-[#2563EB]/20
            blur-[120px]
            animate-[holiSmokeTwo_15s_ease-in-out_infinite]
          "
        />

        {/* Pink smoke */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-96
            w-96
            rounded-full
            bg-[#EC4899]/20
            blur-[120px]
            animate-[holiSmokeThree_16s_ease-in-out_infinite]
          "
        />

        {/* Purple smoke */}
        <div
          className="
            absolute
            bottom-0
            right-0
            h-96
            w-96
            rounded-full
            bg-[#8B5CF6]/15
            blur-[120px]
            animate-[holiSmokeFour_14s_ease-in-out_infinite]
          "
        />

        {/* Golden center glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-80
            w-80
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#FBBF24]/20
            blur-[100px]
            animate-[holiCenter_8s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            FLOATING HOLI POWDER
        ================================================== */}

        <span
          className="
            absolute
            left-[10%]
            top-[18%]
            h-3
            w-3
            rounded-full
            bg-[#F97316]/70
            animate-[holiParticleOne_5s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute
            left-[20%]
            top-[70%]
            h-4
            w-4
            rounded-full
            bg-[#EC4899]/60
            animate-[holiParticleThree_7s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute
            right-[12%]
            top-[25%]
            h-2
            w-2
            rounded-full
            bg-[#2563EB]/70
            animate-[holiParticleTwo_6s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute
            right-[20%]
            bottom-[22%]
            h-3
            w-3
            rounded-full
            bg-[#FBBF24]/80
            animate-[holiParticleOne_6s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute
            left-[45%]
            top-[12%]
            h-2
            w-2
            rounded-full
            bg-[#8B5CF6]/60
            animate-[holiParticleTwo_7s_ease-in-out_infinite]
          "
        />
      </div>

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-lg">
        <div
          className="
            overflow-hidden
            rounded-[2rem]
            border
            border-white/80
            bg-white/90
            shadow-[0_30px_100px_rgba(59,36,21,0.18)]
            backdrop-blur-xl
          "
        >
          {/* Colorful top line */}
          <div className="h-1.5 bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#2563EB]" />

          <div className="p-7 sm:p-10">
            {/* =================================================
                LOGO
            ================================================== */}

            <div className="mb-6 flex justify-center">
              <Link
                href="/"
                aria-label="Go to Hindustan Yuva Vrindha home page"
                className="group relative"
              >
                {/* Golden glow */}
                <div
                  className="
                    absolute
                    -inset-4
                    rounded-full
                    bg-[#FBBF24]/30
                    blur-xl
                    transition
                    duration-300
                    group-hover:bg-[#FBBF24]/45
                  "
                />

                {/* Logo */}
                <div
                  className="
                    relative
                    h-24
                    w-24
                    overflow-hidden
                    rounded-full
                    border-4
                    border-[#FBBF24]
                    bg-white
                    shadow-xl
                    transition
                    duration-300
                    group-hover:scale-105
                    group-hover:shadow-2xl
                  "
                >
                  <img
                    src="/images/Hyv_logo.jpg"
                    alt="Hindustan Yuva Vrindha"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
            </div>

            {/* =================================================
                DEVOTIONAL PILL
            ================================================== */}

            <div className="text-center">
              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#FFF3C4]
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#9A6700]
                "
              >
                <MdAutoAwesome size={16} />
                श्री गणेशाय नमः
              </div>

              {/* =================================================
                  TITLE
              ================================================== */}

              <h1
                className="
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-[#3B2415]
                  sm:text-4xl
                "
              >
                Welcome Back
              </h1>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-[#6B5B4D]
                "
              >
                Login to continue your journey with
                Hindustan Yuva Vrindha.
              </p>
            </div>

            {/* =================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* =================================================
                SUCCESS MESSAGE
            ================================================== */}

            {success && (
              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-green-700
                "
              >
                {success}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#3B2415]
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <MdEmail
                    size={21}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#EA580C]
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E8DCCB]
                      bg-[#FFFDF5]
                      py-3.5
                      pl-12
                      pr-4
                      text-sm
                      text-[#3B2415]
                      outline-none
                      transition
                      placeholder:text-[#A69A8D]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-[#F97316]/10
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#3B2415]
                    "
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="
                      text-xs
                      font-semibold
                      text-[#EA580C]
                      transition
                      hover:text-[#C2410C]
                    "
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  {/* Lock Icon */}
                  <MdLock
                    size={21}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#EA580C]
                    "
                  />

                  {/* Password Input */}
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E8DCCB]
                      bg-[#FFFDF5]
                      py-3.5
                      pl-12
                      pr-12
                      text-sm
                      text-[#3B2415]
                      outline-none
                      transition
                      placeholder:text-[#A69A8D]
                      focus:border-[#F97316]
                      focus:ring-2
                      focus:ring-[#F97316]/10
                    "
                  />

                  {/* =================================================
                      SHOW / HIDE PASSWORD BUTTON
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-2
                      text-[#8B7B6B]
                      transition
                      hover:bg-orange-50
                      hover:text-[#EA580C]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#F97316]/20
                    "
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={21} />
                    ) : (
                      <MdVisibility size={21} />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#EA580C]
                  via-[#F97316]
                  to-[#FBBF24]
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-[#EA580C]/20
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    <MdLogin size={20} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                REGISTER
            ================================================== */}

            <p className="mt-7 text-center text-sm text-[#6B5B4D]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="
                  font-bold
                  text-[#EA580C]
                  transition
                  hover:text-[#C2410C]
                "
              >
                Create Account
              </Link>
            </p>

            {/* =================================================
                VALUES
            ================================================== */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                justify-center
                gap-x-5
                gap-y-2
                border-t
                border-[#E8DCCB]
                pt-6
                text-xs
                font-semibold
                text-[#8B7B6B]
              "
            >
              <span>Bhakti</span>
              <span>•</span>
              <span>Seva</span>
              <span>•</span>
              <span>Sanskriti</span>
              <span>•</span>
              <span>Samarpan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
