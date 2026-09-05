import type { Metadata } from "next";
import { Envelope, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { MEDICAL_DISCLAIMER, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Ropana Wound Care for mobile wound care and telehealth consultations across the Dallas-Fort Worth area.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact us"
        intro="Questions about mobile visits, telehealth or whether we reach your area? Send a message or call us directly."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-xl">{site.name}</h2>

            <dl className="mt-6 flex flex-col gap-5">
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
                <Envelope
                  size={20}
                  weight="duotone"
                  aria-hidden
                  className="mt-0.5 shrink-0 text-brand"
                />
                <div>
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-muted">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.emailHref}
                      className="break-all text-[16px] font-medium text-strong transition-colors hover:text-brand"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin
                  size={20}
                  weight="duotone"
                  aria-hidden
                  className="mt-0.5 shrink-0 text-brand"
                />
                <div>
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-muted">
                    Service area
                  </dt>
                  <dd className="mt-1 text-[16px] text-body">
                    Serving the {site.serviceAreaLong}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 rounded-card border border-line bg-surface-2 p-6">
              <h3 className="text-[15px] font-semibold text-strong">
                Need an appointment rather than an answer?
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-body">
                Use the booking request form to tell us the date and time window
                that suits you.
              </p>
              <ButtonLink href="/booking" size="sm" className="mt-4">
                Book a Visit
              </ButtonLink>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              {MEDICAL_DISCLAIMER}
            </p>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
