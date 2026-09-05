import "server-only";
import { dbConnect } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";
import { isManagedUploadUrl, parseUploadUrl } from "@/lib/uploads";

/**
 * Delete the stored binary behind a managed upload URL.
 *
 * Called whenever an image is replaced or removed, so orphaned binaries do not
 * accumulate in the database. Anything that is not a `/api/uploads/...` URL is
 * ignored: external URLs and legacy disk paths are not ours to delete.
 *
 * Never throws. A failed cleanup must not fail the caller's write.
 */
export async function deleteUploadByUrl(
  url: string | null | undefined
): Promise<boolean> {
  if (!isManagedUploadUrl(url)) return false;

  const parsed = parseUploadUrl(url as string);
  if (!parsed) return false;

  try {
    await dbConnect();
    const result = await StoredUpload.deleteOne({
      folder: parsed.folder,
      filename: parsed.filename,
    });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("[uploads.deleteUploadByUrl]", error);
    return false;
  }
}

/**
 * Delete the previous image only when it actually changed. Used by update
 * handlers where the incoming payload may or may not touch the image field.
 */
export async function replaceUpload(
  previousUrl: string | null | undefined,
  nextUrl: string | null | undefined
): Promise<void> {
  if (!previousUrl) return;
  if (previousUrl === nextUrl) return;
  await deleteUploadByUrl(previousUrl);
}
