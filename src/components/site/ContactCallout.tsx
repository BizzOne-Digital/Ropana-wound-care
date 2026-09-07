import { Phone, Printer } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * Client-supplied contact block: practice, clinician, phone, fax and the
 * appointment call to action. Used at the close of the marketing pages that
 * carry the client's own copy, in place of the generic CTA band.
 */
export function ContactCallout({
  tone = "tinted",
}: {
  tone?: "default" | "tinted";
}) {
  return (
    <Section tone={tone} labelledBy="contact-callout-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Contact</Eyebrow>
          <SectionHeading id="contact-callout-heading">
            {site.name}
          </SectionHeading>
          <p className="mt-4 text-[16px] font-medium text-strong">
            {site.clinician}
          </p>
          <p className="mt-1 text-[15px] text-brand">{site.clinicianRole}</p>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-card border border-line bg-surface p-6 md:p-8">
            <dl className="flex flex-col gap-5 sm:flex-row sm:gap-10">
              <div className="flex gap-4">
                <Phone
                  size={20}
                  weight="duotone"
                  aria-hidden
                  className="mt-0.5 shrink-0 text-brand"
                />
                <div>
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-muted">
                    Phone
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.phoneHref}
                      className="text-[17px] font-semibold text-strong transition-colors hover:text-brand"
                    >
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Printer
                  size={20}
                  weight="duotone"
                  aria-hidden
                  className="mt-0.5 shrink-0 text-accent"
                />
                <div>
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-muted">
                    Fax
                  </dt>
                  <dd className="mt-1 text-[17px] font-semibold text-strong">
                    {site.faxDisplay}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-7 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
              <ButtonLink href="/booking" size="lg">
                Request an Appointment Today
              </ButtonLink>
              <p className="text-[14px] leading-relaxed text-body sm:ml-2">
                We will contact you to confirm availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
