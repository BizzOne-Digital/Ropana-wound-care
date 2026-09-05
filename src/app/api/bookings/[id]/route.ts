import { dbConnect, serialize } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { bookingStatusSchema, objectId } from "@/lib/validation";
import { fail, ok, parseBody, requireAdmin, serverError } from "@/lib/api";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  const parsed = await parseBody(request, bookingStatusSchema);
  if (!parsed.success) return parsed.response;

  try {
    await dbConnect();
    const doc = await Booking.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    ).lean();
    if (!doc) return fail("Booking request not found.", 404);
    return ok(serialize(doc));
  } catch (error) {
    return serverError("bookings.update", error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  if (!objectId.safeParse(id).success) return fail("Invalid identifier.", 400);

  try {
    await dbConnect();
    const doc = await Booking.findByIdAndDelete(id).lean();
    if (!doc) return fail("Booking request not found.", 404);
    return ok({ deleted: id });
  } catch (error) {
    return serverError("bookings.delete", error);
  }
}
