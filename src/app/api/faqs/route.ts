import { revalidatePath } from "next/cache";
import { dbConnect, serialize } from "@/lib/db";
import { Faq } from "@/models/Faq";
import { faqSchema } from "@/lib/validation";
import { ok, parseBody, requireAdmin, serverError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const wantsAll = new URL(request.url).searchParams.get("all") === "1";

  try {
    if (wantsAll) {
      const { response } = await requireAdmin();
      if (response) return response;
    }

    await dbConnect();
    const filter = wantsAll ? {} : { published: true };
    const docs = await Faq.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    return ok(serialize(docs));
  } catch (error) {
    return serverError("faqs.list", error);
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = await parseBody(request, faqSchema);
  if (!parsed.success) return parsed.response;

  try {
    await dbConnect();
    const doc = await Faq.create(parsed.data);

    revalidatePath("/");
    revalidatePath("/faq");

    return ok(serialize(doc.toObject()), 201);
  } catch (error) {
    return serverError("faqs.create", error);
  }
}
