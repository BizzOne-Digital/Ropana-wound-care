import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { ErrorNotice } from "@/components/ui/States";
import { listTestimonials } from "@/lib/admin-data";
import type { AdminTestimonial } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  let testimonials: AdminTestimonial[] = [];
  let loadError = false;

  try {
    testimonials = await listTestimonials();
  } catch (error) {
    console.error("[admin.testimonials]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Publish only feedback a patient has given you permission to share. Nothing appears on the website until it is published."
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <TestimonialsManager testimonials={testimonials} />
      )}
    </>
  );
}
