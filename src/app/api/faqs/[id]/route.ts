import { revalidatePath } from "next/cache";
import { dbConnect, serialize } from "@/lib/db";
import { Faq } from "@/models/Faq";
import { faqUpdateSchema, objectId } from "@/lib/validation";
import { fail, ok, parseBody, requireAdmin, serverError } from "@/lib/api";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  const parsed = await parseBody(request, faqUpdateSchema);
  if (!parsed.success) return parsed.response;

  try {
    await dbConnect();
    const doc = await Faq.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!doc) return fail("Question not found.", 404);

    revalidatePath("/");
    revalidatePath("/faq");

    return ok(serialize(doc));
  } catch (error) {
    return serverError("faqs.update", error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  try {
    await dbConnect();
    const doc = await Faq.findByIdAndDelete(id).lean();
    if (!doc) return fail("Question not found.", 404);

    revalidatePath("/");
    revalidatePath("/faq");

    return ok({ deleted: id });
  } catch (error) {
    return serverError("faqs.delete", error);
  }
}
