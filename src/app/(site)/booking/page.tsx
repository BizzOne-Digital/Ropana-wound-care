import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { BookingForm } from "@/components/site/BookingForm";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/States";
import { Icon } from "@/components/ui/Icon";
import { getPublishedServices } from "@/lib/content";
import { MEDICAL_DISCLAIMER, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Visit",
  description:
    "Request a mobile wound care visit or telehealth consultation in the Dallas-Fort Worth area. We contact you to confirm availability.",
  alternates: { canonical: "/booking" },
};

const expectations = [
  {
    icon: "calendar",
    title: "You send a request",
    body: "Tell us the date and time window that suits you, and the service you think you need.",
  },
  {
    icon: "clipboard",
    title: "We confirm availability",
    body: "We call or email you to agree a time and gather the clinical details we need.",
  },
  {
    icon: "van",
    title: "Care is delivered",
    body: "We come to you, or meet you by secure video if telehealth is more appropriate.",
  },
];

export default async function BookingPage() {
  const services = await getPublishedServices();
  const serviceOptions = (services ?? []).map((s) => s.title);

  return (
    <>
      <PageHeader
        title="Request a visit"
        intro="Send a request and we will contact you to confirm availability. Submitting this form does not confirm an appointment."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="flex flex-col gap-6">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-12 w-48" />
                </div>
              }
            >
              <BookingForm serviceOptions={serviceOptions} />
            </Suspense>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-line bg-surface-2 p-6">
              <h2 className="text-lg">What happens next</h2>
              <ol className="mt-6 flex flex-col gap-6">
                {expectations.map((step) => (
                  <li key={step.title} className="flex gap-4">
                    <Icon
                      name={step.icon}
                      size={22}
                      className="mt-0.5 shrink-0 text-brand"
                    />
                    <div>
                      <p className="text-[15px] font-semibold text-strong">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-body">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-[14px] text-body">
                  Prefer to talk it through?
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-1 block text-lg font-semibold text-brand"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              {MEDICAL_DISCLAIMER}
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
