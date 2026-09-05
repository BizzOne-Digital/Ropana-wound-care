import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/lib/site";

/** Editorial band: heading left, two-column body right. No imagery by design. */
export function Telehealth() {
  return (
    <Section labelledBy="telehealth-heading">
      <div className="rounded-card border border-line bg-surface-2 px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading id="telehealth-heading" className="text-[2rem] md:text-[2.4rem]">
              Telehealth consultations
            </SectionHeading>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2">
              <p className="text-[15px] leading-relaxed text-body">
                Some parts of wound care do not need someone in the room. A
                secure video consultation is a practical way to review progress,
                talk through a dressing routine, or decide whether an in-person
                visit is needed.
              </p>
              <p className="text-[15px] leading-relaxed text-body">
                Telehealth suits follow-ups, questions between visits and initial
                conversations. Where an in-person assessment is more appropriate,
                we will say so and arrange a mobile visit instead.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/booking?service=Telehealth+Consultation">
                Schedule a Consultation
              </ButtonLink>
              <a
                href={site.phoneHref}
                className="text-[15px] font-medium text-strong underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand"
              >
                Or call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
