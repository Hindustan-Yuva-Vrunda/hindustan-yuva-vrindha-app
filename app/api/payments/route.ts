
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

function parseContributionDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

// GET /api/payments?year=2026
// All authenticated users can view all collections.
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
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
        { success: false, message: "Invalid year." },
        { status: 400 }
      );
    }

    const collections = await prisma.contribution.findMany({
      where: { year },
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
        { contributionDate: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("GET /api/payments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load collections.",
      },
      { status: 500 }
    );
  }
}

// POST /api/payments
// Only EDITOR and ADMIN can create collections.
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    if (
      currentUser.role !== "EDITOR" &&
      currentUser.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only editors and admins can create collections.",
        },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    if (user.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is not approved.",
        },
        { status: 403 }
      );
    }

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

    if (
      typeof contributorName !== "string" ||
      !contributorName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Contributor name is required.",
        },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than 0.",
        },
        { status: 400 }
      );
    }

    if (!isPaymentMode(paymentMode)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment mode." },
        { status: 400 }
      );
    }

    const parsedYear = Number(year);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid collection year.",
        },
        { status: 400 }
      );
    }

    const parsedDate = parseContributionDate(contributionDate);

    if (!parsedDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid collection date is required.",
        },
        { status: 400 }
      );
    }

    if (parsedDate.getFullYear() !== parsedYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection date must belong to the selected year.",
        },
        { status: 400 }
      );
    }

    const contribution = await prisma.contribution.create({
      data: {
        // Record the authenticated editor/admin who created it.
        agentId: user.id,
        contributorName: contributorName.trim(),
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
          typeof purpose === "string" && purpose.trim()
            ? purpose.trim()
            : null,
        year: parsedYear,
        contributionDate: parsedDate,
        notes:
          typeof notes === "string" && notes.trim()
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

    return NextResponse.json(
      {
        success: true,
        message: "Collection created successfully.",
        collection: contribution,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/payments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create collection.",
      },
      { status: 500 }
    );
  }
}