import { dbConnect, serialize } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { contactSchema, CONTACT_STATUSES } from "@/lib/validation";
import { fail, ok, parseBody, requireAdmin, serverError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: submit a contact enquiry. */
export async function POST(request: Request) {
  const parsed = await parseBody(request, contactSchema);
  if (!parsed.success) return parsed.response;

  const { name, email, phone, message } = parsed.data;

  try {
    await dbConnect();
    const doc = await Contact.create({ name, email, phone, message });
    // Return only an acknowledgement, never the stored document.
    return ok({ id: doc._id.toString() }, 201);
  } catch (error) {
    return serverError("contact.create", error);
  }
}

/** Admin: list submissions with optional status filter and search. */
export async function GET(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = {};
  if (status && (CONTACT_STATUSES as readonly string[]).includes(status)) {
    filter.status = status;
  }
  if (q) {
    // Escape user input before it reaches a RegExp.
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }];
  }

  try {
    await dbConnect();
    const docs = await Contact.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    return ok(serialize(docs));
  } catch (error) {
    return serverError("contact.list", error);
  }
}

export async function DELETE() {
  return fail("Delete a single submission at /api/contact/[id].", 405);
}
