import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks, site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-surface px-5 py-20 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        {site.name}
      </p>
      <h1 className="mt-5 max-w-[24ch] text-4xl leading-[1.1] md:text-5xl">
        We could not find that page
      </h1>
      <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-body">
        The page may have moved, or the link may be out of date. Here is the way
        back.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Back to home
        </ButtonLink>
        <ButtonLink href="/contact" size="lg" variant="secondary">
          Contact Us
        </ButtonLink>
      </div>

      <nav aria-label="Site pages" className="mt-12">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[14px] text-muted transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
