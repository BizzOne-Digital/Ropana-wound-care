"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowSquareOut,
  CalendarCheck,
  ChatCircleDots,
  Envelope,
  Images,
  List,
  Question,
  SignOut,
  SquaresFour,
  Stethoscope,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useToast } from "@/components/admin/Toast";
import { cx } from "@/lib/format";
import { site } from "@/lib/site";

const links = [
  { href: "/admin", label: "Overview", Icon: SquaresFour, exact: true },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  { href: "/admin/contacts", label: "Contacts", Icon: Envelope },
  { href: "/admin/services", label: "Services", Icon: Stethoscope },
  { href: "/admin/testimonials", label: "Testimonials", Icon: ChatCircleDots },
  { href: "/admin/faqs", label: "FAQs", Icon: Question },
  { href: "/admin/media", label: "Media", Icon: Images },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { notify } = useToast();
  const [navOpen, setNavOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setNavOpen(false), [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      notify("Could not sign out. Please try again.", "error");
      setLoggingOut(false);
    }
  }

  const nav = (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
      {links.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex items-center gap-3 rounded-control px-3 py-2.5 text-[14px] transition-colors",
              active
                ? "bg-brand-soft font-medium text-brand"
                : "text-body hover:bg-surface-3 hover:text-strong"
            )}
          >
            <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-line pt-4">
      <p className="truncate text-[13px] font-medium text-strong">{user.name}</p>
      <p className="truncate text-[12px] text-muted">{user.email}</p>

      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center gap-2 text-[13px] text-body transition-colors hover:text-brand"
      >
        <ArrowSquareOut size={15} aria-hidden />
        View public site
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-3 flex items-center gap-2 text-[13px] text-body transition-colors hover:text-danger disabled:opacity-60"
      >
        <SignOut size={15} aria-hidden />
        {loggingOut ? "Signing out" : "Sign out"}
      </button>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-surface-2">
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <span className="text-[15px] font-semibold text-strong">
          {site.name}
        </span>
        <button
          type="button"
          onClick={() => setNavOpen((v) => !v)}
          aria-expanded={navOpen}
          aria-controls="admin-nav"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-strong"
        >
          {navOpen ? <X size={18} aria-hidden /> : <List size={18} aria-hidden />}
        </button>
      </div>

      <div className="lg:flex">
        <aside
          id="admin-nav"
          className={cx(
            "border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:w-64 lg:shrink-0 lg:flex-col lg:border-r",
            navOpen ? "block border-b px-4 py-5" : "hidden lg:flex"
          )}
        >
          <div className="hidden px-2 pb-6 pt-6 lg:block">
            <Link href="/admin" className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-strong">
                Ropana
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
                Dashboard
              </span>
            </Link>
          </div>

          <div className="flex flex-1 flex-col gap-6 lg:px-2 lg:pb-6">
            {nav}
            {footer}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
