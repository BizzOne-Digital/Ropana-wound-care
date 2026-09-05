import { revalidatePath } from "next/cache";
import { dbConnect, serialize } from "@/lib/db";
import { WoundCase } from "@/models/WoundCase";
import { objectId, woundCaseUpdateSchema } from "@/lib/validation";
import { fail, ok, parseBody, requireAdmin, serverError } from "@/lib/api";
import { deleteUploadByUrl, replaceUpload } from "@/lib/uploads.server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  const parsed = await parseBody(request, woundCaseUpdateSchema);
  if (!parsed.success) return parsed.response;

  try {
    await dbConnect();

    const previous = await WoundCase.findById(id).lean();
    if (!previous) return fail("Result not found.", 404);

    // A patch may set `published` without resending `consent` (the publish
    // toggle in the list does exactly that), so the rule is checked against the
    // document as it will be once merged rather than against the payload alone.
    const merged = { ...previous, ...parsed.data };
    if (merged.published && !merged.consent) {
      return fail("Please correct the highlighted fields.", 422, {
        consent:
          "Confirm you hold written patient consent before publishing.",
      });
    }

    const doc = await WoundCase.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();

    // Replacing either image leaves the old binary orphaned in the uploads
    // collection. Only act on a field the payload actually touched.
    if (parsed.data.beforeImage !== undefined) {
      await replaceUpload(previous.beforeImage, parsed.data.beforeImage);
    }
    if (parsed.data.afterImage !== undefined) {
      await replaceUpload(previous.afterImage, parsed.data.afterImage);
    }

    revalidatePath("/");

    return ok(serialize(doc));
  } catch (error) {
    return serverError("woundCases.update", error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  try {
    await dbConnect();
    const doc = await WoundCase.findByIdAndDelete(id).lean();
    if (!doc) return fail("Result not found.", 404);

    await deleteUploadByUrl(doc.beforeImage);
    await deleteUploadByUrl(doc.afterImage);

    revalidatePath("/");

    return ok({ deleted: id });
  } catch (error) {
    return serverError("woundCases.delete", error);
  }
}
