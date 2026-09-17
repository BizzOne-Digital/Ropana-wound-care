import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { PaymentForm } from "@/app/(site)/pay/PaymentForm";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/States";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Make a Payment",
  description:
    "Pay a Ropana Wound Care invoice securely online. Card details are handled by Stripe.",
  alternates: { canonical: "/pay" },
};

export default function PayPage() {
  return (
    <>
      <PageHeader
        title="Make a payment"
        intro="Settle an invoice securely online. This is separate from booking a visit - you never need to pay to request an appointment."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="flex flex-col gap-6">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-12 w-56" />
                </div>
              }
            >
              <PaymentForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-line bg-surface-2 p-6">
              <h2 className="text-lg">Before you pay</h2>
              <ul className="mt-6 flex flex-col gap-6">
                <li className="flex gap-4">
                  <Icon
                    name="clipboard"
                    size={22}
                    className="mt-0.5 shrink-0 text-brand"
                  />
                  <p className="text-[14px] leading-relaxed text-body">
                    Enter the amount exactly as it appears on your invoice. If
                    the amount looks wrong, call us before paying.
                  </p>
                </li>
                <li className="flex gap-4">
                  <Icon
                    name="certificate"
                    size={22}
                    className="mt-0.5 shrink-0 text-brand"
                  />
                  <p className="text-[14px] leading-relaxed text-body">
                    Payment is processed by Stripe. Card numbers go straight
                    to Stripe and are never seen or stored by us.
                  </p>
                </li>
              </ul>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-[14px] text-body">Questions about a bill?</p>
                <a
                  href={site.phoneHref}
                  className="mt-1 block text-lg font-semibold text-brand"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
