import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getPublishedServices, getSiteImages } from "@/lib/content";
import { site } from "@/lib/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, images] = await Promise.all([
    getPublishedServices(),
    getSiteImages(),
  ]);

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.name,
    description:
      "Mobile wound care and telehealth consultations across the Dallas-Fort Worth area.",
    url: site.url,
    telephone: `+1${site.phoneDigits}`,
    email: site.email,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Dallas-Fort Worth Metroplex, Texas",
    },
    employee: {
      "@type": "Person",
      name: "Alwin Joy",
      jobTitle: "Family Nurse Practitioner, Wound Care Specialist",
    },
    availableService: (services ?? []).map((s) => ({
      "@type": "MedicalTherapy",
      name: s.title,
      url: `${site.url}/services/${s.slug}`,
    })),
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header logoUrl={images.logo || undefined} />
      <main id="main">{children}</main>
      <Footer services={services ?? []} logoUrl={images.logo || undefined} />
      <script
        type="application/ld+json"
        // Structured data is generated from our own database, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
}
