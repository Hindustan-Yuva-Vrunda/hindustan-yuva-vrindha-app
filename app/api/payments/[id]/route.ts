import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const PAYMENT_MODES = [
  "CASH",
  "UPI",
  "BANK_TRANSFER",
  "OTHER",
] as const;

type PaymentMode =
  (typeof PAYMENT_MODES)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/collection/:id
 */
export async function GET(
  _request: Request,
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

    const collection =
      await prisma.contribution.findUnique({
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

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection not found.",
        },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "USER" &&
      collection.agentId !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to access this collection.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error(
      "GET /api/collection/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch collection.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/collection/:id
 *
 * USER:
 *   Can update their own collection.
 *
 * ADMIN:
 *   Can update any collection.
 */
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

    const existingCollection =
      await prisma.contribution.findUnique({
        where: {
          id,
        },
      });

    if (!existingCollection) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection not found.",
        },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "USER" &&
      existingCollection.agentId !==
        currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to update this collection.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updateData: {
      contributorName?: string;
      contributorPhone?: string | null;
      contributorAddress?: string | null;
      amount?: number;
      paymentMode?: PaymentMode;
      purpose?: string | null;
      year?: number;
      contributionDate?: Date;
      notes?: string | null;
    } = {};

    if (body.contributorName !== undefined) {
      if (
        typeof body.contributorName !==
          "string" ||
        !body.contributorName.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Contributor name cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.contributorName =
        body.contributorName.trim();
    }

    if (body.contributorPhone !== undefined) {
      updateData.contributorPhone =
        typeof body.contributorPhone ===
          "string" &&
        body.contributorPhone.trim()
          ? body.contributorPhone.trim()
          : null;
    }

    if (
      body.contributorAddress !== undefined
    ) {
      updateData.contributorAddress =
        typeof body.contributorAddress ===
          "string" &&
        body.contributorAddress.trim()
          ? body.contributorAddress.trim()
          : null;
    }

    if (body.amount !== undefined) {
      const amount = Number(body.amount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Amount must be greater than zero.",
          },
          { status: 400 }
        );
      }

      updateData.amount = amount;
    }

    if (body.paymentMode !== undefined) {
      if (
        !PAYMENT_MODES.includes(
          body.paymentMode as PaymentMode
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid payment mode.",
          },
          { status: 400 }
        );
      }

      updateData.paymentMode =
        body.paymentMode as PaymentMode;
    }

    if (body.purpose !== undefined) {
      updateData.purpose =
        typeof body.purpose === "string" &&
        body.purpose.trim()
          ? body.purpose.trim()
          : null;
    }

    if (body.year !== undefined) {
      const year = Number(body.year);

      if (
        !Number.isInteger(year) ||
        year < 2000
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid year.",
          },
          { status: 400 }
        );
      }

      updateData.year = year;
    }

    if (
      body.contributionDate !== undefined
    ) {
      const contributionDate =
        new Date(body.contributionDate);

      if (
        Number.isNaN(
          contributionDate.getTime()
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid contribution date.",
          },
          { status: 400 }
        );
      }

      updateData.contributionDate =
        contributionDate;
    }

    if (body.notes !== undefined) {
      updateData.notes =
        typeof body.notes === "string" &&
        body.notes.trim()
          ? body.notes.trim()
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No valid fields were provided.",
        },
        { status: 400 }
      );
    }

    const collection =
      await prisma.contribution.update({
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
        "Collection updated successfully.",
      collection,
    });
  } catch (error) {
    console.error(
      "PATCH /api/collection/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update collection.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/collection/:id
 *
 * USER:
 *   Can delete their own collection.
 *
 * ADMIN:
 *   Can delete any collection.
 */
export async function DELETE(
  _request: Request,
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

    const collection =
      await prisma.contribution.findUnique({
        where: {
          id,
        },
      });

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection not found.",
        },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "USER" &&
      collection.agentId !== currentUser.idd
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to delete this collection.",
        },
        { status: 403 }
      );
    }

    await prisma.contribution.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Collection deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/collection/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete collection.",
      },
      { status: 500 }
    );
  }
}
