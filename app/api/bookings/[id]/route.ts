import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

type BookingUpdateData = {
  devoteeName?: string;
  devoteePhone?: string | null;
  devoteeAddress?: string | null;
  poojaName?: string;
  amount?: number;
  bookingDate?: Date;
  year?: number;
  notes?: string | null;
  bookingStatus?: BookingStatus;
};

function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function dateToUtc(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// ==========================================================
// GET /api/bookings/[id]
// USER: can view own booking
// ADMIN: can view any booking
// ==========================================================

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.poojaBooking.findUnique({
      where: { id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "USER" &&
      booking.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to access this booking.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch booking." },
      { status: 500 }
    );
  }
}

// ==========================================================
// PATCH /api/bookings/[id]
// USER: can update own booking
// ADMIN: can update any booking and booking status
// Supports changing bookingDate and year.
// ==========================================================

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.poojaBooking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "USER" &&
      booking.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to update this booking.",
        },
        { status: 403 }
      );
    }

    if (booking.bookingStatus === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message: "A cancelled booking cannot be edited.",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const {
      devoteeName,
      phone,
      devoteePhone,
      devoteeAddress,
      poojaName,
      amount,
      bookingDate,
      notes,
      bookingStatus,
    } = body as Record<string, unknown>;

    const updateData: BookingUpdateData = {};

    // DEVOTEE NAME
    if (devoteeName !== undefined) {
      if (
        typeof devoteeName !== "string" ||
        !devoteeName.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Devotee name cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.devoteeName = devoteeName.trim();
    }

    // PHONE
    const phoneValue =
      devoteePhone !== undefined ? devoteePhone : phone;

    if (phoneValue !== undefined) {
      if (
        phoneValue !== null &&
        typeof phoneValue !== "string"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid phone number." },
          { status: 400 }
        );
      }

      if (
        typeof phoneValue === "string" &&
        phoneValue.trim() &&
        !/^\d{10}$/.test(phoneValue.trim())
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone number must contain exactly 10 digits.",
          },
          { status: 400 }
        );
      }

      updateData.devoteePhone =
        typeof phoneValue === "string" && phoneValue.trim()
          ? phoneValue.trim()
          : null;
    }

    // ADDRESS
    if (devoteeAddress !== undefined) {
      if (
        devoteeAddress !== null &&
        typeof devoteeAddress !== "string"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid address." },
          { status: 400 }
        );
      }

      updateData.devoteeAddress =
        typeof devoteeAddress === "string" &&
        devoteeAddress.trim()
          ? devoteeAddress.trim()
          : null;
    }

    // POOJA NAME
    if (poojaName !== undefined) {
      if (
        typeof poojaName !== "string" ||
        !poojaName.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Pooja name cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.poojaName = poojaName.trim();
    }

    // AMOUNT
    if (amount !== undefined) {
      const numericAmount = Number(amount);

      if (
        amount === "" ||
        amount === null ||
        !Number.isFinite(numericAmount) ||
        numericAmount < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Amount must be a valid non-negative number.",
          },
          { status: 400 }
        );
      }

      updateData.amount = numericAmount;
    }

    // BOOKING DATE / RESCHEDULING
    if (bookingDate !== undefined) {
      if (!isValidDateString(bookingDate)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid booking date. Please select a valid date.",
          },
          { status: 400 }
        );
      }

      const newDate = dateToUtc(bookingDate);

      // Compare calendar dates, avoiding timezone shifts.
      const existingDate = booking.bookingDate
        .toISOString()
        .slice(0, 10);

      const dateChanged = bookingDate !== existingDate;

      if (dateChanged) {
        const dayEnd = new Date(
          newDate.getTime() + 24 * 60 * 60 * 1000
        );

        // A cancelled booking does not occupy the date.
        // Exclude the booking currently being edited.
        const conflictingBooking =
          await prisma.poojaBooking.findFirst({
            where: {
              id: { not: id },
              bookingStatus: { not: "CANCELLED" },
              bookingDate: {
                gte: newDate,
                lt: dayEnd,
              },
            },
            select: {
              id: true,
            },
          });

        if (conflictingBooking) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This date is already booked. Please select another date.",
            },
            { status: 409 }
          );
        }
      }

      updateData.bookingDate = newDate;
      updateData.year = newDate.getUTCFullYear();
    }

    // NOTES
    if (notes !== undefined) {
      if (
        notes !== null &&
        typeof notes !== "string"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid notes." },
          { status: 400 }
        );
      }

      updateData.notes =
        typeof notes === "string" && notes.trim()
          ? notes.trim()
          : null;
    }

    // BOOKING STATUS: ADMIN ONLY
    if (bookingStatus !== undefined) {
      if (currentUser.role !== "ADMIN") {
        return NextResponse.json(
          {
            success: false,
            message: "Only admin can change booking status.",
          },
          { status: 403 }
        );
      }

      const validStatuses: BookingStatus[] = [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
      ];

      if (
        typeof bookingStatus !== "string" ||
        !validStatuses.includes(bookingStatus as BookingStatus)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid booking status." },
          { status: 400 }
        );
      }

      updateData.bookingStatus = bookingStatus as BookingStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields provided for update.",
        },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.poojaBooking.update({
      where: { id },
      data: updateData,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update booking." },
      { status: 500 }
    );
  }
}

// ==========================================================
// DELETE /api/bookings/[id]
// USER: can cancel own booking
// ADMIN: can cancel any booking
// Soft delete: bookingStatus = CANCELLED
// ==========================================================

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.poojaBooking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "USER" &&
      booking.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to cancel this booking.",
        },
        { status: 403 }
      );
    }

    if (booking.bookingStatus === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message: "Booking is already cancelled.",
        },
        { status: 400 }
      );
    }

    const cancelledBooking = await prisma.poojaBooking.update({
      where: { id },
      data: { bookingStatus: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully.",
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel booking.",
      },
      { status: 500 }
    );
  }
}
