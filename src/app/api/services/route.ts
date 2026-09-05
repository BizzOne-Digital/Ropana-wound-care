import { revalidatePath } from "next/cache";
import { dbConnect, serialize } from "@/lib/db";
import { Service } from "@/models/Service";
import { serviceSchema } from "@/lib/validation";
import { fail, ok, parseBody, requireAdmin, serverError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET is public and returns published services only, unless an authenticated
 * admin asks for everything with ?all=1.
 */
export async function GET(request: Request) {
  const wantsAll = new URL(request.url).searchParams.get("all") === "1";

  try {
    if (wantsAll) {
      const { response } = await requireAdmin();
      if (response) return response;
    }

    await dbConnect();
    const filter = wantsAll ? {} : { published: true };
    const docs = await Service.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return ok(serialize(docs));
  } catch (error) {
    return serverError("services.list", error);
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = await parseBody(request, serviceSchema);
  if (!parsed.success) return parsed.response;

  try {
    await dbConnect();

    const clash = await Service.findOne({ slug: parsed.data.slug }).lean();
    if (clash) {
      return fail("Please correct the highlighted fields.", 409, {
        slug: "That URL slug is already in use.",
      });
    }

    const doc = await Service.create(parsed.data);

    revalidatePath("/");
    revalidatePath("/services");

    return ok(serialize(doc.toObject()), 201);
  } catch (error) {
    return serverError("services.create", error);
  }
}
