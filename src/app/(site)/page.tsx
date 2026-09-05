import type { Metadata } from "next";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { ServicesSection } from "@/components/site/ServicesSection";
import { MobileCare } from "@/components/site/MobileCare";
import { Telehealth } from "@/components/site/Telehealth";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { AboutPreview } from "@/components/site/AboutPreview";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { FaqSection } from "@/components/site/FaqSection";
import { ServiceArea } from "@/components/site/ServiceArea";
import { CtaBand } from "@/components/site/CtaBand";
import {
  getPublishedFaqs,
  getPublishedServices,
  getPublishedTestimonials,
  getPublishedWoundCases,
  getSiteImages,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Mobile Wound Care in the DFW Area",
  description:
    "Ropana Wound Care provides mobile wound care visits and telehealth consultations across the Dallas-Fort Worth area, led by a board-certified family nurse practitioner.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [services, testimonials, faqs, woundCases, images] = await Promise.all([
    getPublishedServices(),
    getPublishedTestimonials(3),
    getPublishedFaqs(6),
    getPublishedWoundCases(3),
    getSiteImages(),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesSection services={services} limit={6} />
      <MobileCare imageUrl={images.mobileCareImage} />
      <Telehealth />
      <WhyChooseUs />
      <AboutPreview imageUrl={images.aboutImage} />
      <BeforeAfter cases={woundCases} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} showAllLink />
      <ServiceArea />
      <CtaBand />
    </>
  );
}
