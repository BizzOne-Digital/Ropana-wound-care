import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { ErrorNotice } from "@/components/ui/States";
import { listBookings } from "@/lib/admin-data";
import type { AdminBooking } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  let bookings: AdminBooking[] = [];
  let loadError = false;

  try {
    bookings = await listBookings();
  } catch (error) {
    console.error("[admin.bookings]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Booking requests"
        description="Requests submitted through the website. A request is not a confirmed appointment until you contact the patient and agree a time."
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <BookingsManager bookings={bookings} />
      )}
    </>
  );
}
