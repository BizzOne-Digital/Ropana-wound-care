import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ropana Wound Care collects and uses the information submitted through this website.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/*
 * BASELINE POLICY - REQUIRES CLIENT AND LEGAL REVIEW BEFORE LAUNCH.
 * This text describes only what the website itself does (form submissions and
 * image storage). It deliberately makes no claim about HIPAA status, business
 * associate agreements, or clinical record handling, because those depend on
 * the practice's own agreements and cannot be asserted here.
 */
const sections = [
  {
    heading: "What this policy covers",
    body: [
      `This policy explains what information ${site.name} collects through this website and how it is used. It applies to the website only. Information collected during clinical care is handled under the practice's own privacy practices, which are provided to patients directly.`,
    ],
  },
  {
    heading: "Information you give us",
    body: [
      "When you submit the contact form or a booking request, we collect the name, email address, phone number, preferred date and time, service selected, and any message you choose to include. We ask you not to include diagnoses, health record details or other sensitive medical information in these forms.",
      "We use this information for one purpose: to contact you about your enquiry or booking request and to arrange care.",
    ],
  },
  {
    heading: "How the information is stored",
    body: [
      "Form submissions are stored in a hosted database accessible only to authorised staff of the practice. Images published on this website are stored with our media hosting provider. Access to the administrative dashboard requires a username and password.",
    ],
  },
  {
    heading: "Sharing",
    body: [
      "We do not sell your information. We do not share it with third parties for advertising. Information is shared only with the service providers who host this website and its database, and only to the extent needed to operate the site, or where we are required to do so by law.",
    ],
  },
  {
    heading: "Retention",
    body: [
      "Contact and booking submissions are retained while they are needed to respond to you and to keep a record of the request, and are deleted when they are no longer needed for that purpose.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      `You can ask us what website information we hold about you, ask us to correct it, or ask us to delete it. Email ${site.email} or call ${site.phoneDisplay} and we will respond.`,
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If this policy changes, the updated version will be posted on this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy policy"
        intro={`How ${site.name} handles the information you submit through this website.`}
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
              Questions about this policy
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Contact {site.name} at{" "}
              <a
                href={site.emailHref}
                className="font-medium text-brand underline underline-offset-4"
              >
                {site.email}
              </a>{" "}
              or{" "}
              <a
                href={site.phoneHref}
                className="font-medium text-brand underline underline-offset-4"
              >
                {site.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
