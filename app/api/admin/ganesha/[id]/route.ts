import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getGridFSBucket } from "@/lib/mongodb";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const ganesha = await prisma.ganesha.findUnique({
      where: {
        id,
      },
    });

    if (!ganesha) {
      return NextResponse.json(
        {
          success: false,
          message: "Ganesha not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ganesha,
    });
  } catch (error) {
    console.error("Get Ganesha error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Ganesha.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    // ADMIN ONLY
    await requireAdmin();

    const { id } = await context.params;

    const existing = await prisma.ganesha.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Ganesha not found.",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const yearValue = formData.get("year");
    const titleValue = formData.get("title");
    const descriptionValue = formData.get("description");
    const imageValue = formData.get("image");

    const year = Number(yearValue);
    const title = String(titleValue ?? "").trim();
    const description = String(descriptionValue ?? "").trim();

    if (!year || !Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid year is required.",
        },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 }
      );
    }

    // Check if another record already uses this year
    const duplicateYear = await prisma.ganesha.findFirst({
      where: {
        year,
        NOT: {
          id,
        },
      },
    });

    if (duplicateYear) {
      return NextResponse.json(
        {
          success: false,
          message: `Ganesha for year ${year} already exists.`,
        },
        { status: 409 }
      );
    }

    let imageUrl = existing.imageUrl;

    // Replace image only if a new image was uploaded
    if (imageValue instanceof File && imageValue.size > 0) {
      const arrayBuffer = await imageValue.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bucket = await getGridFSBucket();

      const uploadStream = bucket.openUploadStream(
        imageValue.name,
        {
          metadata: {
            year,
            title,
            contentType:
              imageValue.type || "application/octet-stream",
          },
        }
      );

      await new Promise<void>((resolve, reject) => {
        uploadStream.end(buffer);

        uploadStream.on("finish", () => {
          resolve();
        });

        uploadStream.on("error", (error) => {
          reject(error);
        });
      });

      imageUrl = `/api/admin/ganesha/image/${uploadStream.id}`;

      // Delete old GridFS image
      const oldImageId = existing.imageUrl
        .split("/")
        .pop();

      if (
        oldImageId &&
        ObjectId.isValid(oldImageId)
      ) {
        try {
          await bucket.delete(
            new ObjectId(oldImageId)
          );
        } catch (error) {
          console.warn(
            "Could not delete old Ganesha image:",
            error
          );
        }
      }
    }

    const ganesha = await prisma.ganesha.update({
      where: {
        id,
      },
      data: {
        year,
        title,
        description: description || null,
        imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ganesha updated successfully.",
      data: ganesha,
    });
  } catch (error) {
    console.error("Update Ganesha error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Ganesha.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    // ADMIN ONLY
    await requireAdmin();

    const { id } = await context.params;

    const existing = await prisma.ganesha.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Ganesha not found.",
        },
        { status: 404 }
      );
    }

    const bucket = await getGridFSBucket();

    // Delete Prisma record
    await prisma.ganesha.delete({
      where: {
        id,
      },
    });

    // Extract GridFS ID
    const imageId = existing.imageUrl
      .split("/")
      .pop();

    if (
      imageId &&
      ObjectId.isValid(imageId)
    ) {
      try {
        await bucket.delete(
          new ObjectId(imageId)
        );
      } catch (error) {
        console.warn(
          "Could not delete GridFS image:",
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ganesha deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Ganesha error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete Ganesha.",
      },
      { status: 500 }
    );
  }
}