import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getGridFSBucket } from "@/lib/mongodb";

/**
 * GET
 *
 * Anyone can access this endpoint.
 *
 * Returns all Ganesha gallery records.
 *
 * Multiple images can belong to the same year.
 */
export async function GET() {
  try {
    const ganesha = await prisma.ganesha.findMany({
      orderBy: [
        {
          year: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: ganesha,
    });
  } catch (error) {
    console.error("Get Ganesha error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Ganesha records.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST
 *
 * ADMIN ONLY
 *
 * Supports:
 *
 * 1. Single upload
 *    formData:
 *      year
 *      title
 *      description
 *      image
 *
 * 2. Bulk upload
 *    formData:
 *      year
 *      title
 *      description
 *      images[]
 *
 * Multiple images can belong to the same year.
 */
export async function POST(request: Request) {
  try {
    // -----------------------------------------
    // ADMIN AUTHENTICATION
    // -----------------------------------------
    await requireAdmin();

    // -----------------------------------------
    // READ FORM DATA
    // -----------------------------------------
    const formData = await request.formData();

    const yearValue = formData.get("year");
    const titleValue = formData.get("title");
    const descriptionValue = formData.get("description");

    const year = Number(yearValue);
    const title = String(titleValue ?? "").trim();
    const description = String(descriptionValue ?? "").trim();

    // -----------------------------------------
    // VALIDATE YEAR
    // -----------------------------------------
    if (!year || !Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid year is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (year < 1900 || year > 2100) {
      return NextResponse.json(
        {
          success: false,
          message: "Year must be between 1900 and 2100.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // VALIDATE TITLE
    // -----------------------------------------
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // GET UPLOADED IMAGES
    // -----------------------------------------
    //
    // We support both:
    //
    // image  -> single upload
    //
    // images -> multiple upload
    //
    const singleImage = formData.get("image");

    const multipleImages = formData
      .getAll("images")
      .filter(
        (value): value is File =>
          value instanceof File
      );

    const images: File[] = [];

    // Single upload
    if (singleImage instanceof File) {
      images.push(singleImage);
    }

    // Bulk upload
    if (multipleImages.length > 0) {
      images.push(...multipleImages);
    }

    // -----------------------------------------
    // VALIDATE IMAGES
    // -----------------------------------------
    if (images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one Ganesha image is required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // MAX BULK UPLOAD LIMIT
    // -----------------------------------------
    //
    // Prevent accidental upload of hundreds
    // of images in one request.
    //
    const MAX_BULK_IMAGES = 30;

    if (images.length > MAX_BULK_IMAGES) {
      return NextResponse.json(
        {
          success: false,
          message: `You can upload a maximum of ${MAX_BULK_IMAGES} images at once.`,
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // VALIDATE EACH IMAGE
    // -----------------------------------------
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

    for (const image of images) {
      if (image.size === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Image "${image.name}" is empty.`,
          },
          {
            status: 400,
          }
        );
      }

      if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Image "${image.name}" is larger than 5 MB.`,
          },
          {
            status: 400,
          }
        );
      }

      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: `"${image.name}" is not a valid image file.`,
          },
          {
            status: 400,
          }
        );
      }
    }

    // -----------------------------------------
    // GRIDFS
    // -----------------------------------------
    const bucket = await getGridFSBucket();

    // -----------------------------------------
    // UPLOAD IMAGES
    // -----------------------------------------
    const createdRecords = [];

    for (const image of images) {
      try {
        // Convert File → Buffer
        const arrayBuffer = await image.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        // Upload to MongoDB GridFS
        const uploadStream = bucket.openUploadStream(
          image.name,
          {
            metadata: {
              year,
              title,
              contentType:
                image.type ||
                "application/octet-stream",
            },
          }
        );

        // Wait until GridFS upload completes
        await new Promise<void>(
          (resolve, reject) => {
            uploadStream.end(buffer);

            uploadStream.on(
              "finish",
              () => {
                resolve();
              }
            );

            uploadStream.on(
              "error",
              (error) => {
                reject(error);
              }
            );
          }
        );

        // -----------------------------------------
        // IMAGE URL
        // -----------------------------------------
        const imageUrl = `/api/admin/ganesha/image/${uploadStream.id}`;

        // -----------------------------------------
        // CREATE PRISMA RECORD
        // -----------------------------------------
        const ganesha =
          await prisma.ganesha.create({
            data: {
              year,
              title,
              description:
                description || null,
              imageUrl,
            },
          });

        createdRecords.push(ganesha);
      } catch (imageError) {
        console.error(
          `Failed to upload image "${image.name}":`,
          imageError
        );

        // Continue with remaining images
      }
    }

    // -----------------------------------------
    // CHECK WHETHER ANY IMAGE WAS CREATED
    // -----------------------------------------
    if (createdRecords.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to upload the Ganesha image(s).",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // RESPONSE MESSAGE
    // -----------------------------------------
    const uploadedCount =
      createdRecords.length;

    const skippedCount =
      images.length - uploadedCount;

    let message = "";

    if (uploadedCount === 1) {
      message =
        "Ganesha image uploaded successfully.";
    } else {
      message = `${uploadedCount} Ganesha images uploaded successfully.`;
    }

    if (skippedCount > 0) {
      message += ` ${skippedCount} image(s) could not be uploaded.`;
    }

    // -----------------------------------------
    // SUCCESS RESPONSE
    // -----------------------------------------
    return NextResponse.json(
      {
        success: true,
        message,
        data: createdRecords,
        uploadedCount,
        skippedCount,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create Ganesha error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create Ganesha record(s).",
      },
      {
        status: 500,
      }
    );
  }
}
