import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const PAYMENT_MODES = [
  "CASH",
  "UPI",
  "BANK_TRANSFER",
  "OTHER",
] as const;

type PaymentMode = (typeof PAYMENT_MODES)[number];

function isPaymentMode(
  value: unknown
): value is PaymentMode {
  return (
    typeof value === "string" &&
    PAYMENT_MODES.includes(value as PaymentMode)
  );
}

function parseContributionDate(value: unknown) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

// ==================================================
// GET /api/collection?year=2026
// ==================================================

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const yearParam = searchParams.get("year");

    const year = yearParam
      ? Number(yearParam)
      : new Date().getFullYear();

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

    // ----------------------------------------------
    // USER sees only their own collections
    // ADMIN sees all collections
    // ----------------------------------------------

    const where =
      currentUser.role === "ADMIN"
        ? {
            year,
          }
        : {
            year,
            agentId: currentUser.id,
          };

    const collections =
      await prisma.contribution.findMany({
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
            contributionDate: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error(
      "Get collections error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load collections.",
      },
      { status: 500 }
    );
  }
}

// ==================================================
// POST /api/collection
// ==================================================

export async function POST(request: Request) {
  try {
    // ----------------------------------------------
    // 1. Authentication
    // ----------------------------------------------

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login to create a collection.",
        },
        { status: 401 }
      );
    }

    // ----------------------------------------------
    // 2. Only USER/member can create
    // ----------------------------------------------

    if (currentUser.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only members can create collections.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------
    // 3. Verify user in database
    // ----------------------------------------------

    const user =
      await prisma.user.findUnique({
        where: {
          id: currentUser.id,
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
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

    // ----------------------------------------------
    // 4. Must be approved
    // ----------------------------------------------

    if (user.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account is not approved.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------
    // 5. Request body
    // ----------------------------------------------

    const body = await request.json();

    const {
      contributorName,
      contributorPhone,
      contributorAddress,
      amount,
      paymentMode,
      purpose,
      year,
      contributionDate,
      notes,
    } = body;

    // ----------------------------------------------
    // 6. Contributor name
    // ----------------------------------------------

    if (
      typeof contributorName !== "string" ||
      !contributorName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Contributor name is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 7. Amount
    // ----------------------------------------------

    const parsedAmount = Number(amount);

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Amount must be greater than 0.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 8. Payment mode
    // ----------------------------------------------

    if (!isPaymentMode(paymentMode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment mode.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 9. Year
    // ----------------------------------------------

    const parsedYear = Number(year);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid collection year.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 10. Contribution date
    // ----------------------------------------------

    const parsedDate =
      parseContributionDate(
        contributionDate
      );

    if (!parsedDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid collection date is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 11. Date must match selected year
    // ----------------------------------------------

    if (
      parsedDate.getFullYear() !==
      parsedYear
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Collection date must belong to the selected year.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 12. Create Contribution
    // ----------------------------------------------

    const contribution =
      await prisma.contribution.create({
        data: {
          // IMPORTANT:
          // Always take agentId from the
          // authenticated user.

          agentId: user.id,

          contributorName:
            contributorName.trim(),

          contributorPhone:
            typeof contributorPhone === "string" &&
            contributorPhone.trim()
              ? contributorPhone.trim()
              : null,

          contributorAddress:
            typeof contributorAddress === "string" &&
            contributorAddress.trim()
              ? contributorAddress.trim()
              : null,

          amount: parsedAmount,

          paymentMode,

          purpose:
            typeof purpose === "string" &&
            purpose.trim()
              ? purpose.trim()
              : null,

          year: parsedYear,

          contributionDate: parsedDate,

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

    // ----------------------------------------------
    // 13. Success
    // ----------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Collection created successfully.",
        collection: contribution,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create collection error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating the collection.",
      },
      { status: 500 }
    );
  }
}
