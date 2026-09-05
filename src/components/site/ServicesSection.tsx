import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading, Lede } from "@/components/ui/Section";
import { EmptyState, ErrorNotice } from "@/components/ui/States";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/site/ServiceCard";
import type { ServiceDTO } from "@/lib/content";

export function ServicesSection({
  services,
  limit,
}: {
  services: ServiceDTO[] | null;
  limit?: number;
}) {
  const list = limit ? (services ?? []).slice(0, limit) : services ?? [];

  return (
    <Section labelledBy="services-heading" id="services">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionHeading id="services-heading">What we treat</SectionHeading>
          <Lede className="mt-4 text-body">
            Wound care assessment, treatment and follow-up, delivered in your
            home or by telehealth.
          </Lede>
        </div>
        {list.length > 0 ? (
          <ButtonLink href="/services" variant="secondary" className="shrink-0">
            All services
          </ButtonLink>
        ) : null}
      </div>

      <div className="mt-10">
        {services === null ? (
          <ErrorNotice body="Our services list is temporarily unavailable. Please call us and we will talk you through what we offer." />
        ) : list.length === 0 ? (
          <EmptyState
            title="Services are being added"
            body="Service listings are managed from the admin dashboard and will appear here as soon as they are published."
            action={
              <ButtonLink href="/contact" variant="secondary" size="sm">
                Ask us what we treat
              </ButtonLink>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((service, i) => (
              <Reveal key={service._id} delay={i * 0.05}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
