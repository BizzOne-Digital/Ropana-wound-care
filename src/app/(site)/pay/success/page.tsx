import type { Metadata } from "next";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment Received",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * Reaching this URL proves nothing - anyone can type it, and Stripe sends the
 * browser here for failed payments too. The session is read back from Stripe
 * and only `payment_status: "paid"` is treated as paid.
 */
async function getPaidAmount(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    return (session.amount_total ?? 0) / 100;
  } catch (error) {
    console.error("[payments.verify]", error);
    return null;
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const amount = await getPaidAmount(session_id);

  return (
    <Section>
      <div className="mx-auto max-w-xl rounded-card border border-line p-8 text-center">
        {amount === null ? (
          <>
            <WarningCircle
              size={36}
              weight="duotone"
              aria-hidden
              className="mx-auto text-warning"
            />
            <h1 className="mt-4 text-xl">We could not confirm this payment</h1>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-body">
              Your card may not have been charged. Please do not pay again until
              you have spoken to us - call {site.phoneDisplay} and we will check
              the payment for you.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/pay" variant="secondary" size="sm">
                Back to payments
              </ButtonLink>
              <a
                href={site.phoneHref}
                className="text-[15px] font-medium text-brand underline underline-offset-4"
              >
                Call {site.phoneDisplay}
              </a>
            </div>
          </>
        ) : (
          <>
            <CheckCircle
              size={36}
              weight="duotone"
              aria-hidden
              className="mx-auto text-success"
            />
            <h1 className="mt-4 text-xl">
              Payment of ${amount.toFixed(2)} received
            </h1>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-body">
              Thank you. Stripe has emailed your receipt. If you need anything
              else, call us on {site.phoneDisplay}.
            </p>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/" variant="secondary" size="sm">
                Back to home
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
