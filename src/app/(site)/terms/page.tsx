import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/ui/Section";
import { MEDICAL_DISCLAIMER, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing the use of the Ropana Wound Care website and the booking request form.",
  alternates: { canonical: "/terms" },
};

/*
 * BASELINE TERMS - REQUIRES CLIENT AND LEGAL REVIEW BEFORE LAUNCH.
 * Scope is limited to website use and the booking request flow.
 */
const sections = [
  {
    heading: "Using this website",
    body: [
      `This website is provided by ${site.name} for general information about the practice and to let you request contact or a visit. By using it you agree to these terms.`,
    ],
  },
  {
    heading: "No medical advice",
    body: [MEDICAL_DISCLAIMER],
  },
  {
    heading: "Booking requests",
    body: [
      "Submitting the booking form sends a request. It does not create or confirm an appointment. An appointment exists only once a member of the practice has contacted you and confirmed a time. We may be unable to accommodate a requested date, time or service.",
    ],
  },
  {
    heading: "Accuracy of the information you provide",
    body: [
      "Please make sure the contact details you submit are correct, so we can reach you. We are not able to respond to requests submitted with incomplete or inaccurate contact information.",
    ],
  },
  {
    heading: "Website content",
    body: [
      "We aim to keep the content of this website accurate and current, but it is provided as general information and may change without notice. Text, images and other material on this website belong to the practice or its licensors and may not be copied or republished without permission.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "This website relies on third-party hosting, database and media services to operate. Their availability is outside our control, and short interruptions may occur.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "If these terms change, the updated version will be posted on this page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of service"
        intro={`The terms that apply when you use the ${site.name} website.`}
      />
      <Section>
        <div className="flex max-w-[68ch] flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl">{section.heading}</h2>
              <div className="mt-3 flex flex-col gap-3 text-[16px] leading-relaxed text-body">
                {section.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-card border border-line bg-surface-2 p-6">
            <h2 className="text-[15px] font-semibold text-strong">
              In an emergency
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Call 911 or go to your nearest emergency department. Do not use
              this website to report an emergency.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
