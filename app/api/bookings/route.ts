import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ----------------------------------------------------------
// GENERATE BOOKING NUMBER
// ----------------------------------------------------------

function generateBookingNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `HYV-${timestamp}-${random}`;
}

// ----------------------------------------------------------
// VALIDATE DATE
// ----------------------------------------------------------

function isValidDate(value: string) {
  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

// ----------------------------------------------------------
// GET /api/bookings
// ----------------------------------------------------------
//
// USER  -> sees only their own bookings
// ADMIN -> sees all bookings
//
// Optional:
// /api/bookings?year=2026
// /api/bookings?year=2026&status=CONFIRMED
// ----------------------------------------------------------

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const yearParam = searchParams.get("year");
    const status = searchParams.get("status");

    const year = yearParam
      ? Number(yearParam)
      : undefined;

    // ----------------------------------------------------------
    // VALIDATE YEAR
    // ----------------------------------------------------------

    if (
      yearParam &&
      (!Number.isInteger(year) ||
        year! < 2000 ||
        year! > 2100)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid year.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // WHERE CONDITION
    // ----------------------------------------------------------

    const where: {
      agentId?: string;

      year?: number;

      bookingStatus?:
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED"
        | "COMPLETED";
    } = {};

    // USER -> only own bookings
    if (currentUser.role === "USER") {
      where.agentId = currentUser.id;
    }

    // YEAR FILTER
    if (year !== undefined) {
      where.year = year;
    }

    // STATUS FILTER
    if (
      status === "PENDING" ||
      status === "CONFIRMED" ||
      status === "CANCELLED" ||
      status === "COMPLETED"
    ) {
      where.bookingStatus = status;
    }

    // ----------------------------------------------------------
    // FETCH BOOKINGS
    // ----------------------------------------------------------

    const bookings =
      await prisma.poojaBooking.findMany({
        where,

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

        orderBy: [
          {
            bookingDate: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET /api/bookings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings.",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------
// POST /api/bookings
// ----------------------------------------------------------
//
// USER only
//
// Body:
//
// {
//   "date": "2026-12-07",
//   "devoteeName": "Ramesh Kumar",
//   "phone": "9876543210",
//   "poojaName": "Ganapati Pooja",
//   "amount": 0,
//   "notes": ""
// }
//
// bookingDate -> selected date
// createdAt   -> automatic creation date/time
// year        -> derived from date
// agentId     -> logged-in user
// ----------------------------------------------------------

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    // ----------------------------------------------------------
    // AUTHENTICATION
    // ----------------------------------------------------------

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    // ----------------------------------------------------------
    // ONLY USER CAN CREATE BOOKING
    // ----------------------------------------------------------

    if (currentUser.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only members can create bookings.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // CHECK USER
    // ----------------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // ONLY APPROVED USERS CAN BOOK
    // ----------------------------------------------------------

    if (user.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is not approved.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // READ BODY
    // ----------------------------------------------------------

    const body = await request.json();

    const {
      date,
      devoteeName,
      phone,
      poojaName,
      amount,
      notes,
    } = body;

    // ----------------------------------------------------------
    // VALIDATE DATE
    // ----------------------------------------------------------

    if (
      !date ||
      typeof date !== "string" ||
      !isValidDate(date)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid booking date is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // VALIDATE DEVOTEE NAME
    // ----------------------------------------------------------

    if (
      !devoteeName ||
      typeof devoteeName !== "string" ||
      !devoteeName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Devotee name is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // VALIDATE POOJA NAME
    // ----------------------------------------------------------

    if (
      !poojaName ||
      typeof poojaName !== "string" ||
      !poojaName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Pooja name is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // VALIDATE AMOUNT
    // ----------------------------------------------------------

    let numericAmount = 0;

    if (
      amount !== undefined &&
      amount !== null &&
      amount !== ""
    ) {
      numericAmount = Number(amount);

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Amount must be a valid number.",
          },
          { status: 400 }
        );
      }
    }

    // ----------------------------------------------------------
    // PARSE BOOKING DATE
    // ----------------------------------------------------------

    const parsedBookingDate = new Date(date);

    if (Number.isNaN(parsedBookingDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking date.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // DERIVE YEAR
    // ----------------------------------------------------------

    const numericYear =
      parsedBookingDate.getFullYear();

    // ----------------------------------------------------------
    // START / END OF SELECTED DAY
    // ----------------------------------------------------------

    const startOfDay = new Date(
      parsedBookingDate
    );

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date(
      parsedBookingDate
    );

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    // ----------------------------------------------------------
    // CHECK WHETHER DATE IS ALREADY BOOKED
    // ----------------------------------------------------------

    const existingBooking =
      await prisma.poojaBooking.findFirst({
        where: {
          year: numericYear,

          bookingDate: {
            gte: startOfDay,
            lte: endOfDay,
          },

          bookingStatus: {
            not: "CANCELLED",
          },
        },
      });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "This date has already been booked.",
        },
        { status: 409 }
      );
    }

    // ----------------------------------------------------------
    // CREATE BOOKING
    // ----------------------------------------------------------

    const booking =
      await prisma.poojaBooking.create({
        data: {
          bookingNumber:
            generateBookingNumber(),

          agentId: currentUser.id,

          poojaName: poojaName.trim(),

          amount: numericAmount,

          devoteeName: devoteeName.trim(),

          devoteePhone:
            typeof phone === "string" &&
            phone.trim()
              ? phone.trim()
              : null,

          year: numericYear,

          bookingDate:
            parsedBookingDate,

          bookingStatus: "CONFIRMED",

          notes:
            typeof notes === "string" &&
            notes.trim()
              ? notes.trim()
              : null,
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

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Pooja booking created successfully.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/bookings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking.",
      },
      { status: 500 }
    );
  }
}
