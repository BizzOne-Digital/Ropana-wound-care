import { Section, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { mission } from "@/lib/site";

/**
 * Client-supplied mission statement. Rendered as a two-column read so the
 * heading holds the left rail and the copy stays inside a comfortable measure.
 */
export function Mission({
  tone = "tinted",
}: {
  tone?: "default" | "tinted";
}) {
  return (
    <Section tone={tone} labelledBy="mission-heading">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Our mission</Eyebrow>
          <SectionHeading id="mission-heading">{mission.heading}</SectionHeading>
        </div>

        <div className="flex max-w-[64ch] flex-col gap-4 text-[16px] leading-relaxed text-body lg:col-span-7">
          {mission.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
