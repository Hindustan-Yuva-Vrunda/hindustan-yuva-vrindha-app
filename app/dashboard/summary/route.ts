import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const yearValue = searchParams.get("year");
    const year = Number(yearValue);

    if (!year || !Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid year is required.",
        },
        { status: 400 }
      );
    }

    // ==========================================================
    // ALL MEMBERS' POOJA BOOKINGS
    // ==========================================================

    const bookingCount = await prisma.poojaBooking.count({
      where: {
        year,
        bookingStatus: {
          not: "CANCELLED",
        },
      },
    });

    // ==========================================================
    // ALL MEMBERS' CONTRIBUTIONS
    // ==========================================================

    const contributionResult =
      await prisma.contribution.aggregate({
        where: {
          year,
        },
        _sum: {
          amount: true,
        },
      });

    const collectionAmount =
      contributionResult._sum.amount ?? 0;

    // ==========================================================
    // DAILY BOOKING COUNT
    // ==========================================================

    const bookings = await prisma.poojaBooking.findMany({
      where: {
        year,
        bookingStatus: {
          not: "CANCELLED",
        },
      },

      select: {
        bookingDate: true,
      },
    });

    const bookingCountByDate: Record<string, number> = {};

    for (const booking of bookings) {
      const date = booking.bookingDate
        .toISOString()
        .split("T")[0];

      bookingCountByDate[date] =
        (bookingCountByDate[date] ?? 0) + 1;
    }

    // ==========================================================
    // OPEN DATES
    //
    // A date is open if it has less than 2 bookings.
    // ==========================================================

    const openDates = Object.entries(
      bookingCountByDate
    )
      .filter(([, count]) => count < 2)
      .map(([date]) => date);

    return NextResponse.json({
      success: true,

      data: {
        year,

        // Community-wide values
        collectionAmount,

        bookingCount,

        // Maximum 2 bookings per day
        maxBookingsPerDay: 2,

        bookingCountByDate,

        openDates,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard summary error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load dashboard summary.",
      },
      { status: 500 }
    );
  }
}