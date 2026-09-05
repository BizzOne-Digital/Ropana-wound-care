import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading, Lede } from "@/components/ui/Section";
import { EmptyState, ErrorNotice } from "@/components/ui/States";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import type { FaqDTO } from "@/lib/content";

export function FaqSection({
  faqs,
  searchable = false,
  showAllLink = false,
}: {
  faqs: FaqDTO[] | null;
  searchable?: boolean;
  showAllLink?: boolean;
}) {
  return (
    <Section tone="tinted" labelledBy="faq-heading" id="faq">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-heading">Common questions</SectionHeading>
          <Lede className="mt-4 text-body">
            If your question is not here, call us and we will answer it directly.
          </Lede>
          <ButtonLink href="/contact" variant="secondary" size="sm" className="mt-6">
            Contact Us
          </ButtonLink>
        </div>

        <div className="lg:col-span-8">
          {faqs === null ? (
            <ErrorNotice body="Our questions list is temporarily unavailable. Please try again shortly." />
          ) : faqs.length === 0 ? (
            <EmptyState
              title="No questions published yet"
              body="Questions and answers are managed from the admin dashboard and appear here once published."
            />
          ) : (
            <>
              <FaqAccordion faqs={faqs} searchable={searchable} />
              {showAllLink ? (
                <ButtonLink href="/faq" variant="secondary" size="sm" className="mt-8">
                  All questions
                </ButtonLink>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
