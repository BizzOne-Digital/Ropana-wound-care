import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/api";
import { deleteUploadByUrl } from "@/lib/uploads.server";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  UPLOAD_FOLDERS,
  buildUploadUrl,
  formatBytes,
  isAllowedMimeType,
  isUploadFolder,
} from "@/lib/uploads";

// Buffer and node:crypto require the Node runtime, not the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * This endpoint uses a bare `{ success, ... }` / `{ success: false, error }`
 * shape rather than the site-wide `{ ok, data }` envelope, because the upload
 * contract is consumed directly by the admin image field.
 */
function uploadError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return uploadError("Not authorised.", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return uploadError("Expected a multipart form upload.", 400);
  }

  const folder = form.get("folder");
  if (!isUploadFolder(folder)) {
    return uploadError(
      `Invalid folder. Expected one of: ${UPLOAD_FOLDERS.join(", ")}.`,
      400
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return uploadError("No file was received.", 400);
  }

  if (!isAllowedMimeType(file.type)) {
    return uploadError(
      "Unsupported file type. Upload a JPEG, PNG, WebP or GIF image.",
      415
    );
  }

  if (file.size === 0) {
    return uploadError("That file is empty.", 400);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return uploadError(
      `That image is ${formatBytes(file.size)}. The limit is ${formatBytes(
        MAX_UPLOAD_BYTES
      )}.`,
      413
    );
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${extension}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Re-check after reading: file.size is client-reported metadata, the
    // buffer length is the real payload.
    if (buffer.byteLength > MAX_UPLOAD_BYTES) {
      return uploadError(
        `That image is ${formatBytes(buffer.byteLength)}. The limit is ${formatBytes(
          MAX_UPLOAD_BYTES
        )}.`,
        413
      );
    }

    await dbConnect();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: buffer.byteLength,
      data: buffer,
    });

    return NextResponse.json(
      {
        success: true,
        url: buildUploadUrl(folder, filename),
        filename,
        size: buffer.byteLength,
        folder,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log the real cause server-side; never return a stack to the browser.
    console.error("[upload.create]", error);
    return uploadError("The upload could not be saved. Please try again.", 500);
  }
}

/**
 * Discard an upload that is not referenced by any document yet.
 *
 * The admin image field calls this when an image it just uploaded is replaced
 * or removed before the surrounding form is saved, which would otherwise leave
 * an orphaned binary in the database. Deletes tied to a saved document happen
 * in that document's own route handler.
 */
export async function DELETE(request: Request) {
  const { response } = await requireAdmin();
  if (response) return uploadError("Not authorised.", 401);

  const url = new URL(request.url).searchParams.get("url");
  if (!url) return uploadError("A url query parameter is required.", 400);

  const deleted = await deleteUploadByUrl(url);
  return NextResponse.json({ success: true, deleted });
}
