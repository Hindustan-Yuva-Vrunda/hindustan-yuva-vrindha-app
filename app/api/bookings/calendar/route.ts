import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ==========================================================
// GET /api/bookings/calendar?year=2026&month=12
// ==========================================================
//
// Returns bookings for a specific month.
//
// USER:
// - Can see their own booking details.
// - Other booked dates are shown as BOOKED.
//
// ADMIN:
// - Can see booking details for all bookings.
//
// Dates without bookings are NOT returned.
// The frontend treats them as OPEN.
//
// There is currently no blocked-date model.
// ==========================================================

export async function GET(request: Request) {
  try {
    // ========================================================
    // AUTH
    // ========================================================

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

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const { searchParams } = new URL(request.url);

    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (!yearParam || !monthParam) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Year and month are required.",
        },
        { status: 400 }
      );
    }

    const year = Number(yearParam);
    const month = Number(monthParam);

    // ========================================================
    // VALIDATE YEAR
    // ========================================================

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid year.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // VALIDATE MONTH
    // ========================================================

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid month.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // MONTH RANGE
    // ========================================================

    const startDate = new Date(
      year,
      month - 1,
      1,
      0,
      0,
      0,
      0
    );

    const endDate = new Date(
      year,
      month,
      0,
      23,
      59,
      59,
      999
    );

    // ========================================================
    // FETCH BOOKINGS
    // ========================================================
    //
    // CANCELLED bookings are excluded because their dates
    // should become OPEN again.
    // ========================================================

    const bookings =
      await prisma.poojaBooking.findMany({
        where: {
          bookingDate: {
            gte: startDate,
            lte: endDate,
          },

          bookingStatus: {
            not: "CANCELLED",
          },
        },

        select: {
          id: true,
          bookingNumber: true,
          agentId: true,

          devoteeName: true,
          devoteePhone: true,
          devoteeAddress: true,

          poojaName: true,

          amount: true,

          year: true,
          bookingDate: true,

          bookingStatus: true,

          notes: true,

          createdAt: true,
        },

        orderBy: {
          bookingDate: "asc",
        },
      });

    // ========================================================
    // FORMAT RESPONSE
    // ========================================================

    const data = bookings.map((booking) => {
      const isMyBooking =
        currentUser.role === "USER" &&
        booking.agentId === currentUser.id;

      const canViewDetails =
        currentUser.role === "ADMIN" ||
        booking.agentId === currentUser.id;

      // Convert DateTime to YYYY-MM-DD
      const date =
        booking.bookingDate
          .toISOString()
          .split("T")[0];

      return {
        id: booking.id,

        date,

        status: isMyBooking
          ? "MY_BOOKING"
          : "BOOKED",

        bookingNumber:
          booking.bookingNumber,

        // Only expose personal booking details
        // to the owner or ADMIN.
        devoteeName: canViewDetails
          ? booking.devoteeName
          : undefined,

        devoteePhone: canViewDetails
          ? booking.devoteePhone
          : undefined,

        devoteeAddress: canViewDetails
          ? booking.devoteeAddress
          : undefined,

        poojaName: canViewDetails
          ? booking.poojaName
          : undefined,

        amount: canViewDetails
          ? booking.amount
          : undefined,

        year: booking.year,

        bookingStatus:
          booking.bookingStatus,

        notes: canViewDetails
          ? booking.notes
          : undefined,

        createdAt:
          booking.createdAt,
      };
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "GET /api/bookings/calendar error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch booking calendar.",
      },
      { status: 500 }
    );
  }
}
