import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

    console.log("Ganesha image requested:", id);

    // Check MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid image ID.",
        },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(id);

    const bucket = await getGridFSBucket();

    // Check whether file exists
    const files = await bucket
      .find({
        _id: objectId,
      })
      .toArray();

    console.log(
      "GridFS files found:",
      files.length
    );

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found in GridFS.",
        },
        { status: 404 }
      );
    }

    const file = files[0];

    const contentType =
      typeof file.metadata?.contentType === "string"
        ? file.metadata.contentType
        : "image/jpeg";

    const downloadStream =
      bucket.openDownloadStream(objectId);

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        downloadStream.on(
          "data",
          (chunk: Buffer) => {
            controller.enqueue(
              new Uint8Array(chunk)
            );
          }
        );

        downloadStream.on("end", () => {
          controller.close();
        });

        downloadStream.on(
          "error",
          (error) => {
            console.error(
              "GridFS download error:",
              error
            );

            controller.error(error);
          }
        );
      },

      cancel() {
        downloadStream.destroy();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(
      "Ganesha image API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Ganesha image.",
      },
      { status: 500 }
    );
  }
}
