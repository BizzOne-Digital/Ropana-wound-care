import { dbConnect } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";
import { isSafeFilename, isUploadFolder } from "@/lib/uploads";

// Buffer handling requires the Node runtime.
export const runtime = "nodejs";

type Params = { params: Promise<{ folder: string; filename: string }> };

/**
 * Mongoose returns a Node Buffer for Buffer paths, but the underlying driver
 * can hand back a BSON Binary depending on how the document was read. Normalise
 * both into a Buffer before measuring or sending it.
 */
function toBuffer(value: unknown): Buffer | null {
  if (Buffer.isBuffer(value)) return value;

  if (value && typeof value === "object") {
    const candidate = value as { buffer?: unknown };
    if (Buffer.isBuffer(candidate.buffer)) return candidate.buffer;
    if (candidate.buffer instanceof Uint8Array) {
      return Buffer.from(candidate.buffer);
    }
  }

  if (value instanceof Uint8Array) return Buffer.from(value);
  return null;
}

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Do not let a 404 be cached as though it were the image.
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(_request: Request, { params }: Params) {
  const { folder, filename } = await params;

  // Reject traversal and separator characters before touching the database.
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) {
    return notFound();
  }

  try {
    await dbConnect();

    // `data` is select:false on the schema, so opt in explicitly.
    const doc = await StoredUpload.findOne({ folder, filename })
      .select("+data")
      .lean();

    if (!doc) return notFound();

    const buffer = toBuffer(doc.data);
    if (!buffer) {
      console.error(
        `[uploads.serve] unreadable payload for ${folder}/${filename}`
      );
      return notFound();
    }

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(buffer.byteLength),
        // Filenames are content-addressed by timestamp plus random hex, so a
        // given URL always returns the same bytes and can cache forever.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[uploads.serve]", error);
    return new Response("Unable to load image", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
