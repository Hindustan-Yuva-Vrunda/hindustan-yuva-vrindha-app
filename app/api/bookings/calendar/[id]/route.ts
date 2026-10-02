import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/booking/calendar/:id
 *
 * ADMIN only.
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

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const bookingDate =
      await prisma.poojaBooking.findUnique({
        where: {
          id,
        },
      });

    if (!bookingDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Calendar date not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingDate,
    });
  } catch (error) {
    console.error(
      "GET /api/booking/calendar/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch calendar date.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/booking/calendar/:id
 *
 * ADMIN only.
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

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existingDate =
      await prisma.poojaBooking.findUnique({
        where: {
          id,
        },
      });

    if (!existingDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Calendar date not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      status,
      reason,
    } = body;

    const updateData: {
      status?: "OPEN" | "BLOCKED";
      reason?: string | null;
    } = {};

    if (status !== undefined) {
      if (
        status !== "OPEN" &&
        status !== "BLOCKED"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be OPEN or BLOCKED.",
          },
          { status: 400 }
        );
      }

      /*
       * If opening the date, we remove the record below.
       */
      if (status === "OPEN") {
        await prisma.poojaBooking.delete({
          where: {
            id,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Date opened successfully.",
        });
      }

      updateData.status = "BLOCKED";
    }

    if (reason !== undefined) {
      updateData.reason =
        typeof reason === "string" &&
        reason.trim()
          ? reason.trim()
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields were provided.",
        },
        { status: 400 }
      );
    }

    const updatedDate =
      await prisma.poojaBooking.update({
  where: {
    id,
  },
  data: {
    bookingStatus: status === "OPEN" ? "CONFIRMED" : "CANCELLED",
    notes: reason,
  },
});

    return NextResponse.json({
      success: true,
      message: "Calendar date updated successfully.",
      poojaBooking: updatedDate,
    });
  } catch (error) {
    console.error(
      "PATCH /api/booking/calendar/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update calendar date.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/booking/calendar/:id
 *
 * ADMIN only.
 *
 * Deletes a blocked-date record, making the date OPEN.
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

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existingDate =
      await prisma.poojaBooking.findUnique({
        where: {
          id,
        },
      });

    if (!existingDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Calendar date not found.",
        },
        { status: 404 }
      );
    }

    await prisma.poojaBooking.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Date opened successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/booking/calendar/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to open calendar date.",
      },
      { status: 500 }
    );
  }
}
