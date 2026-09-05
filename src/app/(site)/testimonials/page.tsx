import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { CtaBand } from "@/components/site/CtaBand";
import { getPublishedTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Feedback from patients and families who have received mobile wound care from Ropana Wound Care in the Dallas-Fort Worth area.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <PageHeader
        title="What patients tell us"
        intro="Feedback shared with us by patients and their families. Every testimonial published here was provided with permission."
      />
      <TestimonialsSection testimonials={testimonials} showHeading={false} />
      <CtaBand />
    </>
  );
}
