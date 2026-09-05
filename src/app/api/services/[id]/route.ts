import { revalidatePath } from "next/cache";
import { dbConnect, serialize } from "@/lib/db";
import { Service } from "@/models/Service";
import { objectId, serviceUpdateSchema } from "@/lib/validation";
import { fail, ok, parseBody, requireAdmin, serverError } from "@/lib/api";
import { deleteUploadByUrl, replaceUpload } from "@/lib/uploads.server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  try {
    await dbConnect();
    const doc = await Service.findById(id).lean();
    if (!doc) return fail("Service not found.", 404);
    return ok(serialize(doc));
  } catch (error) {
    return serverError("services.get", error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  const parsed = await parseBody(request, serviceUpdateSchema);
  if (!parsed.success) return parsed.response;

  try {
    await dbConnect();

    if (parsed.data.slug) {
      const clash = await Service.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      }).lean();
      if (clash) {
        return fail("Please correct the highlighted fields.", 409, {
          slug: "That URL slug is already in use.",
        });
      }
    }

    const previous = await Service.findById(id).lean();
    if (!previous) return fail("Service not found.", 404);

    const doc = await Service.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();

    // Replacing or clearing the image leaves the old binary orphaned in the
    // uploads collection. Only act when the payload actually touched the field.
    if (parsed.data.image !== undefined) {
      await replaceUpload(previous.image, parsed.data.image);
    }

    revalidatePath("/");
    revalidatePath("/services");
    if (previous.slug) revalidatePath(`/services/${previous.slug}`);
    if (doc?.slug) revalidatePath(`/services/${doc.slug}`);

    return ok(serialize(doc));
  } catch (error) {
    return serverError("services.update", error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  try {
    await dbConnect();
    const doc = await Service.findByIdAndDelete(id).lean();
    if (!doc) return fail("Service not found.", 404);

    await deleteUploadByUrl(doc.image);

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${doc.slug}`);

    return ok({ deleted: id });
  } catch (error) {
    return serverError("services.delete", error);
  }
}
