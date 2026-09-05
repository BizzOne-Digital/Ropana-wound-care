import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect, serialize } from "@/lib/db";
import { Setting, SETTING_KEYS } from "@/models/Setting";
import { mediaUrl } from "@/lib/validation";
import { ok, parseBody, requireAdmin, serverError } from "@/lib/api";
import { replaceUpload } from "@/lib/uploads.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  key: z.enum([
    SETTING_KEYS.logo,
    SETTING_KEYS.heroImage,
    SETTING_KEYS.aboutImage,
    SETTING_KEYS.mobileCareImage,
  ]),
  value: mediaUrl,
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await dbConnect();
    const docs = await Setting.find({}).lean();
    return ok(serialize(docs));
  } catch (error) {
    return serverError("settings.list", error);
  }
}

/** Upsert a single site image slot. */
export async function PUT(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = await parseBody(request, bodySchema);
  if (!parsed.success) return parsed.response;

  const { key, value } = parsed.data;

  try {
    await dbConnect();

    const previous = await Setting.findOne({ key }).lean();

    const doc = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    // Discard the binary this slot used to point at, once the new one is saved.
    await replaceUpload(previous?.value, value);

    // Site imagery appears in the shared layout, so refresh every page.
    revalidatePath("/", "layout");

    return ok(serialize(doc));
  } catch (error) {
    return serverError("settings.update", error);
  }
}
