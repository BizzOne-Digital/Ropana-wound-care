import { Section, SectionHeading, Eyebrow, Lede } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BeforeAfterCard } from "@/components/site/BeforeAfterCard";
import type { WoundCaseDTO } from "@/lib/content";

/**
 * Before / after wound care results, managed from the admin dashboard.
 *
 * Renders nothing at all when there is nothing published, or when the query
 * failed. An empty "no results yet" panel would tell a prospective patient
 * something they do not need to know, so the section simply does not exist
 * until the practice has published a case.
 */
export function BeforeAfter({
  cases,
  showHeading = true,
}: {
  cases: WoundCaseDTO[] | null;
  showHeading?: boolean;
}) {
  if (!cases || cases.length === 0) return null;

  return (
    <Section tone="tinted" labelledBy="results-heading">
      {showHeading ? (
        <div className="max-w-[54ch]">
          <Eyebrow>Before and after</Eyebrow>
          <SectionHeading id="results-heading">
            Wound care results
          </SectionHeading>
          <Lede className="mt-4 text-body">
            Real cases treated by our practice, published with written patient
            consent. Healing times vary with the wound, your health and how the
            plan is followed.
          </Lede>
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((item, i) => (
          <Reveal key={item._id} delay={i * 0.05} className="h-full">
            <BeforeAfterCard item={item} />
          </Reveal>
        ))}
      </div>

      <p className="mt-8 max-w-[70ch] text-[13px] leading-relaxed text-muted">
        Images are shared with patient permission and are examples only. They
        are not a promise of a particular result or a substitute for a clinical
        assessment.
      </p>
    </Section>
  );
}
