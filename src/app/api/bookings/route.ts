import { dbConnect, serialize } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { bookingSchema, BOOKING_STATUSES } from "@/lib/validation";
import { ok, parseBody, requireAdmin, serverError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: submit a booking REQUEST. This never confirms an appointment. */
export async function POST(request: Request) {
  const parsed = await parseBody(request, bookingSchema);
  if (!parsed.success) return parsed.response;

  const { name, email, phone, preferredDate, preferredTime, service, message } =
    parsed.data;

  try {
    await dbConnect();

    // Guard against an accidental duplicate submission (double click, retry):
    // same person, same date, same service within the last two minutes.
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await Booking.findOne({
      email,
      preferredDate,
      service,
      createdAt: { $gte: twoMinutesAgo },
    }).lean();

    if (existing) {
      return ok({ id: existing._id.toString(), duplicate: true }, 200);
    }

    const doc = await Booking.create({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      service,
      message: message ?? "",
    });

    return ok({ id: doc._id.toString(), duplicate: false }, 201);
  } catch (error) {
    return serverError("bookings.create", error);
  }
}

/** Admin: list booking requests. */
export async function GET(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = {};
  if (status && (BOOKING_STATUSES as readonly string[]).includes(status)) {
    filter.status = status;
  }
  if (q) {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { service: rx }];
  }

  try {
    await dbConnect();
    const docs = await Booking.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    return ok(serialize(docs));
  } catch (error) {
    return serverError("bookings.list", error);
  }
}
