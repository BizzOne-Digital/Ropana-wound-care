import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ServicesSection } from "@/components/site/ServicesSection";
import { CtaBand } from "@/components/site/CtaBand";
import { getPublishedServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wound Care Services",
  description:
    "Mobile wound care services across the Dallas-Fort Worth area, including assessment, ongoing treatment and telehealth follow-up.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <PageHeader
        title="Wound care services"
        intro="Assessment, treatment and follow-up delivered in your home or by secure video across the Dallas-Fort Worth area."
      />
      <ServicesSection services={services} />
      <CtaBand />
    </>
  );
}
