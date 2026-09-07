import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks, site } from "@/lib/site";
import type { ServiceDTO } from "@/lib/content";

export function Footer({
  services,
  logoUrl,
}: {
  services: ServiceDTO[];
  logoUrl?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Logo logoUrl={logoUrl} size="lg" />
              {logoUrl ? (
                <span className="whitespace-nowrap font-serif text-[24px] font-semibold tracking-[0.11em] text-brand">
                  Ropana Wound Care
                </span>
              ) : null}
            </div>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-body">
              Mobile wound care and telehealth consultations across the{" "}
              {site.serviceAreaLong}, led by {site.clinician}.
            </p>
            <ButtonLink href="/booking" size="sm" className="mt-6">
              Book a Visit
            </ButtonLink>
          </div>

          <nav className="md:col-span-2" aria-labelledby="footer-nav">
            <h2
              id="footer-nav"
              className="text-[13px] font-semibold uppercase tracking-[0.12em] text-strong"
            >
              Site
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-body transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="text-[13px] font-semibold uppercase tracking-[0.12em] text-strong"
            >
              Services
            </h2>
            {services.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2.5">
                {services.slice(0, 6).map((s) => (
                  <li key={s._id}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm text-body transition-colors hover:text-brand"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                <Link href="/services" className="hover:text-brand">
                  View all services
                </Link>
              </p>
            )}
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-strong">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="font-medium text-strong transition-colors hover:text-brand"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="text-body">
                <span className="text-muted">Fax</span>{" "}
                <span className="font-medium text-strong">{site.faxDisplay}</span>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="break-all text-body transition-colors hover:text-brand"
                >
                  {site.email}
                </a>
              </li>
              <li className="text-body">Serving the {site.serviceAreaLong}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-muted">
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link
                href="/privacy"
                className="text-[13px] text-muted transition-colors hover:text-brand"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-[13px] text-muted transition-colors hover:text-brand"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
