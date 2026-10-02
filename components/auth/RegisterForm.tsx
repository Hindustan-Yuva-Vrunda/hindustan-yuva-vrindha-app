"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  MdArrowForward,
  MdAutoAwesome,
  MdCheckCircle,
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    // -----------------------------
    // Frontend validation
    // -----------------------------

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to create your account."
        );
        return;
      }

      // -----------------------------
      // Registration successful
      // -----------------------------

      setShowSuccessPopup(true);

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // -----------------------------
      // Redirect to public website
      // -----------------------------

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    } catch (error) {
      console.error("Registration request error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFFDF5] px-5 py-12">
      {/* =====================================================
          HOLI SMOKE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orange */}
        <div
          className="
            absolute -left-32 top-0
            h-96 w-96
            rounded-full
            bg-[#F97316]/25
            blur-[110px]
            animate-[holiSmokeOne_12s_ease-in-out_infinite]
          "
        />

        {/* Blue */}
        <div
          className="
            absolute -right-32 top-10
            h-96 w-96
            rounded-full
            bg-[#2563EB]/20
            blur-[120px]
            animate-[holiSmokeTwo_15s_ease-in-out_infinite]
          "
        />

        {/* Pink */}
        <div
          className="
            absolute bottom-0 left-10
            h-96 w-96
            rounded-full
            bg-[#EC4899]/20
            blur-[120px]
            animate-[holiSmokeThree_16s_ease-in-out_infinite]
          "
        />

        {/* Purple */}
        <div
          className="
            absolute bottom-0 right-10
            h-96 w-96
            rounded-full
            bg-[#8B5CF6]/15
            blur-[120px]
            animate-[holiSmokeFour_14s_ease-in-out_infinite]
          "
        />

        {/* Gold */}
        <div
          className="
            absolute left-1/2 top-1/2
            h-80 w-80
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#FBBF24]/20
            blur-[100px]
            animate-[holiCenter_8s_ease-in-out_infinite]
          "
        />

        {/* Powder particles */}
        <span
          className="
            absolute left-[12%] top-[20%]
            h-3 w-3
            rounded-full
            bg-[#F97316]/70
            animate-[holiParticleOne_5s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute right-[15%] top-[25%]
            h-2 w-2
            rounded-full
            bg-[#2563EB]/70
            animate-[holiParticleTwo_6s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute bottom-[25%] left-[18%]
            h-4 w-4
            rounded-full
            bg-[#EC4899]/60
            animate-[holiParticleThree_7s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute bottom-[20%] right-[20%]
            h-3 w-3
            rounded-full
            bg-[#FBBF24]/80
            animate-[holiParticleOne_6s_ease-in-out_infinite]
          "
        />
      </div>

      {/* =====================================================
          REGISTER CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-xl">
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
          {/* Top colorful line */}
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
                TITLE
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

              <h1
                className="
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-[#3B2415]
                  sm:text-4xl
                "
              >
                Create Your Account
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
                Join Hindustan Yuva Vrindha and become part of
                our journey of faith, seva, culture and
                togetherness.
              </p>
            </div>

            {/* =================================================
                ERROR
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
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#3B2415]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <MdPerson
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
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
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

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#3B2415]"
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
                    value={formData.email}
                    onChange={handleChange}
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

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#3B2415]"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <MdPhone
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
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(event) => {
                      const value = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setFormData((prev) => ({
                        ...prev,
                        phone: value,
                      }));

                      setError("");
                    }}
                    placeholder="Enter 10-digit mobile number"
                    autoComplete="tel"
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

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#3B2415]"
                >
                  Password
                </label>

                <div className="relative">
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

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1.5
                      text-[#8B7B6B]
                      transition
                      hover:bg-orange-50
                      hover:text-[#EA580C]
                    "
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={21} />
                    ) : (
                      <MdVisibility size={21} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#8B7B6B]">
                  Minimum 8 characters.
                </p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#3B2415]"
                >
                  Confirm Password
                </label>

                <div className="relative">
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

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
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

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1.5
                      text-[#8B7B6B]
                      transition
                      hover:bg-orange-50
                      hover:text-[#EA580C]
                    "
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff size={21} />
                    ) : (
                      <MdVisibility size={21} />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <MdArrowForward
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* LOGIN */}
            <p className="mt-7 text-center text-sm text-[#6B5B4D]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#EA580C] hover:text-[#C2410C]"
              >
                Login
              </Link>
            </p>

            {/* VALUES */}
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

      {/* =====================================================
          SUCCESS POPUP
      ====================================================== */}

      {showSuccessPopup && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-[#3B2415]/40
            px-5
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-[2rem]
              border
              border-white
              bg-white
              shadow-[0_30px_100px_rgba(59,36,21,0.3)]
              animate-[popupEnter_0.4s_ease-out]
            "
          >
            {/* Top decoration */}
            <div className="h-2 bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#2563EB]" />

            <div className="px-7 py-8 text-center sm:px-10 sm:py-10">
              {/* Success icon */}
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <MdCheckCircle
                  size={56}
                  className="text-green-500"
                />
              </div>

              <div
                className="
                  mb-3
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
                  tracking-[0.14em]
                  text-[#9A6700]
                "
              >
                <MdAutoAwesome size={15} />
                श्री गणेशाय नमः
              </div>

              <h2 className="text-2xl font-extrabold text-[#3B2415] sm:text-3xl">
                Registration Successful!
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6B5B4D]">
                Your account has been created successfully and
                is currently{" "}
                <span className="font-bold text-orange-600">
                  pending admin approval
                </span>
                .
              </p>

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-orange-100
                  bg-[#FFF7E6]
                  px-5
                  py-4
                  text-left
                "
              >
                <p className="text-sm font-semibold text-[#3B2415]">
                  What happens next?
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6B5B4D]">
                  Once an administrator approves your account,
                  you can log in and access the member dashboard.
                </p>
              </div>

              <p className="mt-5 text-xs font-medium text-[#8B7B6B]">
                Redirecting you to the public website...
              </p>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-orange-100">
                <div
                  className="
                    h-full
                    w-full
                    origin-left
                    rounded-full
                    bg-gradient-to-r
                    from-[#F97316]
                    to-[#FBBF24]
                    animate-[successProgress_5s_linear_forwards]
                  "
                />
              </div>

              <Link
                href="/"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#EA580C]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-[#C2410C]
                "
              >
                Go to Website
                <MdArrowForward size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
