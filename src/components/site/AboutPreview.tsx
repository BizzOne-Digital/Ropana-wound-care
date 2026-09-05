import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/lib/site";

export function AboutPreview({ imageUrl }: { imageUrl: string }) {
  return (
    <Section labelledBy="about-heading">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow>Your clinician</Eyebrow>
          <SectionHeading id="about-heading">
            {site.clinician}
          </SectionHeading>
          <p className="mt-2 text-[15px] font-medium text-brand">
            {site.clinicianRole}
          </p>

          <div className="mt-6 flex max-w-[58ch] flex-col gap-4 text-[16px] leading-relaxed text-body">
            <p>
              Ropana Wound Care is a mobile wound care practice serving the{" "}
              {site.serviceAreaLong}. Care is delivered by Alwin Joy, a
              board-certified family nurse practitioner with advanced wound care
              expertise.
            </p>
            <p>
              Every patient is assessed individually. Treatment plans are
              evidence-based, explained in plain language, and adjusted as the
              wound changes, with time set aside for your questions.
            </p>
          </div>

          <ButtonLink href="/about" variant="secondary" className="mt-8">
            Learn More About Us
          </ButtonLink>
        </div>

        <div className="lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-card border border-line lg:ml-auto lg:mr-0">
            {/* TODO(client): replace with a professional portrait via Admin -> Media. */}
            <Image
              src={imageUrl}
              alt={`Portrait of ${site.clinician}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
