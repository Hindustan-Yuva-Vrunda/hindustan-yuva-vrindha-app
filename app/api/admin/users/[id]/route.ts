
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateUserSchema = z
  .object({
    role: z.enum(["USER", "EDITOR"]).optional(),
    status: z
      .enum(["PENDING", "APPROVED", "REJECTED", "BLOCKED"])
      .optional(),
  })
  .refine(
    (data) => data.role !== undefined || data.status !== undefined,
    { message: "Provide a role or status to update." }
  );

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

// ============================================================
// PATCH: UPDATE USER ROLE OR STATUS
// ============================================================

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const body: unknown = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role or status.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Never allow this endpoint to modify the Admin account.
    if (existingUser.role === "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "The Admin account cannot be modified here.",
        },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE: DELETE USER AND ASSOCIATED RECORDS
// ============================================================

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Protect the Admin account.
    if (existingUser.role === "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "The Admin account cannot be deleted.",
        },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete password reset tokens belonging to this user.
      await tx.passwordResetToken.deleteMany({
        where: { userId: id },
      });

      // Your schema uses agentId, not userId.
      await tx.poojaBooking.deleteMany({
        where: { agentId: id },
      });

      // Your schema uses agentId, not userId.
      await tx.contribution.deleteMany({
        where: { agentId: id },
      });

      // Delete the user after deleting dependent records.
      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${existingUser.name} and their associated records were deleted successfully.`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete the user.",
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}