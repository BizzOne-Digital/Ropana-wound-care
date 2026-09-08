"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { List, X, Phone } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/site/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks, site } from "@/lib/site";
import { cx } from "@/lib/format";

export function Header({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the panel on route change and lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/92 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo logoUrl={logoUrl} size="xl" />
          {logoUrl ? (
            <span className="whitespace-nowrap font-serif text-[24px] font-bold tracking-[0.11em] text-brand">
              Ropana Wound Care
            </span>
          ) : null}
        </div>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "text-[15px] transition-colors duration-200",
                      active
                        ? "font-medium text-brand"
                        : "text-body hover:text-strong"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-strong transition-colors hover:text-brand"
          >
            <Phone size={18} aria-hidden />
            {site.phoneDisplay}
          </a>
          <ButtonLink href="/booking" size="sm">
            Book a Visit
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-control border border-line-strong text-strong lg:hidden"
        >
          {open ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-surface lg:hidden"
      >
        <nav aria-label="Primary mobile" className="container-page py-5">
          <ul className="flex flex-col">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href} className="border-b border-line last:border-0">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "block py-3.5 text-base",
                      active ? "font-medium text-brand" : "text-strong"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink href="/booking" size="lg" className="w-full">
              Book a Visit
            </ButtonLink>
            <a
              href={site.phoneHref}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-control border border-line-strong text-[15px] font-medium text-strong"
            >
              <Phone size={18} aria-hidden />
              Call {site.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
