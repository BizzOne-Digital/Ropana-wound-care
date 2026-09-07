import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ServiceArea } from "@/components/site/ServiceArea";
import { Mission } from "@/components/site/Mission";
import { ContactCallout } from "@/components/site/ContactCallout";
import { getSiteImages } from "@/lib/content";
import { differentiators, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Ropana Wound Care is a mobile wound care practice serving the Dallas-Fort Worth area, led by Alwin Joy, FNP-BC, a board-certified family nurse practitioner.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const images = await getSiteImages();

  return (
    <>
      <PageHeader
        title="A wound care practice built around the patient"
        image="/images/feet1.jpg"
        intro={`${site.name} brings advanced wound care to patients across the ${site.serviceAreaLong}, through mobile visits and telehealth consultations.`}
      />

      <Mission />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-line">
              {/* TODO(client): replace with a professional portrait via Admin -> Media. */}
              <Image
                src={images.aboutImage}
                alt={`Portrait of ${site.clinician}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionHeading>{site.clinician}</SectionHeading>
            <p className="mt-2 text-[15px] font-medium text-brand">
              {site.clinicianRole}
            </p>

            <div className="mt-6 flex max-w-[64ch] flex-col gap-4 text-[16px] leading-relaxed text-body">
              <p>
                Alwin Joy is a board-certified family nurse practitioner with
                advanced wound care expertise. Ropana Wound Care was founded to
                make that expertise easier to reach, by bringing it to the
                patient rather than asking the patient to travel.
              </p>
              <p>
                Wounds rarely heal on a fixed schedule. Progress depends on
                circulation, nutrition, underlying conditions and how
                consistently a plan can be followed at home. Care here starts
                with a full assessment of all of that, not just the wound bed.
              </p>
              <p>
                Treatment decisions are grounded in current wound care evidence
                and explained in plain language, so patients and families
                understand what is being done and why. Plans are reviewed and
                adjusted as the wound changes.
              </p>
              <p>
                Where an in-person visit is the right call, we come to you.
                Where a secure video consultation will do, telehealth keeps
                follow-up simple. Either way, the same clinician follows your
                progress.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="tinted" labelledBy="approach-heading">
        <div className="max-w-[52ch]">
          <SectionHeading id="approach-heading">How we work</SectionHeading>
        </div>
        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item) => (
            <div key={item.title}>
              <Icon name={item.icon} size={24} className="text-brand" />
              <dt className="mt-4 text-[15px] font-semibold text-strong">
                {item.title}
              </dt>
              <dd className="mt-2 text-[14px] leading-relaxed text-body">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <ServiceArea />
      <ContactCallout tone="default" />
    </>
  );
}
