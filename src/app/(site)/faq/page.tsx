import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { getPublishedFaqs } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about mobile wound care visits, telehealth consultations, scheduling and service area in the Dallas-Fort Worth area.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

  // Only emit FAQPage structured data when there are real published answers.
  const structuredData =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        intro={`Practical answers about visits, telehealth and scheduling. If something is not covered here, call ${site.phoneDisplay}.`}
      />
      <FaqSection faqs={faqs} searchable />
      <CtaBand />
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}
    </>
  );
}
