import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ==========================================================
// GET /api/bookings/:id
// ==========================================================
//
// USER  -> can view only their own booking
// ADMIN -> can view any booking
// ==========================================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.poojaBooking.findUnique({
      where: {
        id,
      },
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
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    // USER can access only their own booking.
    if (
      currentUser.role === "USER" &&
      booking.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to access this booking.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(
      "GET /api/bookings/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking.",
      },
      { status: 500 }
    );
  }
}

// ==========================================================
// PATCH /api/bookings/:id
// ==========================================================
//
// USER  -> can update their own booking details
// ADMIN -> can update any booking and status
//
// Editable:
// - devoteeName
// - phone / devoteePhone
// - devoteeAddress
// - poojaName
// - amount
// - notes
//
// Date is NOT editable here.
// bookingTime does NOT exist in the current Prisma schema.
// ==========================================================

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.poojaBooking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    // USER can update only their own booking.
    if (
      currentUser.role === "USER" &&
      booking.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to update this booking.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      devoteeName,
      phone,
      devoteePhone,
      devoteeAddress,
      poojaName,
      amount,
      notes,
      bookingStatus,
    } = body;

    const updateData: {
      devoteeName?: string;
      devoteePhone?: string | null;
      devoteeAddress?: string | null;
      poojaName?: string;
      amount?: number;
      notes?: string | null;
      bookingStatus?:
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED"
        | "COMPLETED";
    } = {};

    // ======================================================
    // DEVOTEE NAME
    // ======================================================

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

      updateData.devoteeName =
        devoteeName.trim();
    }

    // ======================================================
    // PHONE
    // ======================================================

    const phoneValue =
      devoteePhone !== undefined
        ? devoteePhone
        : phone;

    if (phoneValue !== undefined) {
      if (
        phoneValue !== null &&
        typeof phoneValue !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid phone number.",
          },
          { status: 400 }
        );
      }

      updateData.devoteePhone =
        typeof phoneValue === "string" &&
        phoneValue.trim()
          ? phoneValue.trim()
          : null;
    }

    // ======================================================
    // ADDRESS
    // ======================================================

    if (devoteeAddress !== undefined) {
      if (
        devoteeAddress !== null &&
        typeof devoteeAddress !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid address.",
          },
          { status: 400 }
        );
      }

      updateData.devoteeAddress =
        typeof devoteeAddress === "string" &&
        devoteeAddress.trim()
          ? devoteeAddress.trim()
          : null;
    }

    // ======================================================
    // POOJA NAME
    // ======================================================

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

      updateData.poojaName =
        poojaName.trim();
    }

    // ======================================================
    // AMOUNT
    // ======================================================

    if (amount !== undefined) {
      const numericAmount = Number(amount);

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Amount must be a valid number.",
          },
          { status: 400 }
        );
      }

      updateData.amount = numericAmount;
    }

    // ======================================================
    // NOTES
    // ======================================================

    if (notes !== undefined) {
      if (
        notes !== null &&
        typeof notes !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid notes.",
          },
          { status: 400 }
        );
      }

      updateData.notes =
        typeof notes === "string" &&
        notes.trim()
          ? notes.trim()
          : null;
    }

    // ======================================================
    // BOOKING STATUS
    // ======================================================
    // Only ADMIN can change status.
    // ======================================================

    if (bookingStatus !== undefined) {
      if (currentUser.role !== "ADMIN") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Only admin can change booking status.",
          },
          { status: 403 }
        );
      }

      if (
        bookingStatus !== "PENDING" &&
        bookingStatus !== "CONFIRMED" &&
        bookingStatus !== "CANCELLED" &&
        bookingStatus !== "COMPLETED"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid booking status.",
          },
          { status: 400 }
        );
      }

      updateData.bookingStatus =
        bookingStatus;
    }

    // ======================================================
    // NOTHING TO UPDATE
    // ======================================================

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No valid fields provided for update.",
        },
        { status: 400 }
      );
    }

    // ======================================================
    // UPDATE
    // ======================================================

    const updatedBooking =
      await prisma.poojaBooking.update({
        where: {
          id,
        },

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
      message:
        "Booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "PATCH /api/bookings/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking.",
      },
      { status: 500 }
    );
  }
}

// ==========================================================
// DELETE /api/bookings/:id
// ==========================================================
//
// USER  -> can cancel their own booking
// ADMIN -> can cancel any booking
//
// Soft delete:
// bookingStatus = CANCELLED
// ==========================================================

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.poojaBooking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    // USER can cancel only their own booking.
    if (
      currentUser.role === "USER" &&
      booking.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to cancel this booking.",
        },
        { status: 403 }
      );
    }

    // Already cancelled.
    if (booking.bookingStatus === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message: "Booking is already cancelled.",
        },
        { status: 400 }
      );
    }

    const cancelledBooking =
      await prisma.poojaBooking.update({
        where: {
          id,
        },

        data: {
          bookingStatus: "CANCELLED",
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Booking cancelled successfully.",
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error(
      "DELETE /api/bookings/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to cancel booking.",
      },
      { status: 500 }
    );
  }
}
