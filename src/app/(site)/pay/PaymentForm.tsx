"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { site } from "@/lib/site";

/**
 * Payments are deliberately independent of the booking form: nothing here
 * touches an appointment, and no payment is required to request a visit.
 *
 * The publishable key is designed to be public - it can only start payments,
 * never read or refund them. loadStripe is called once at module scope so the
 * Stripe script is not refetched on every render.
 */
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-control border border-danger bg-danger-soft px-4 py-3 text-[14px] text-strong"
    >
      {children}
    </div>
  );
}

/** Step 2: Stripe's own fields, driven by the Checkout Session. */
function CardStep({ amount }: { amount: number }) {
  const result = useCheckoutElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (result.type === "loading") {
    return (
      <p className="flex items-center gap-2 text-[15px] text-body">
        <Spinner />
        Loading payment form
      </p>
    );
  }

  if (result.type === "error") {
    return <ErrorBanner>{result.error.message}</ErrorBanner>;
  }

  const checkout = result.checkout;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    const confirmed = await checkout.confirm();

    // On success Stripe sends the browser to the session's return_url, so
    // reaching here means the payment was refused or the details were invalid.
    if (confirmed.type === "error") {
      setError(confirmed.error.message ?? "We could not take this payment.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}

      <PaymentElement />

      <div className="flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner />
              Processing payment
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
        <p className="text-[13px] leading-relaxed text-muted">
          Card details go straight to Stripe and are never stored by us.
        </p>
      </div>
    </form>
  );
}

/** Step 1: the amount, which the server re-checks before opening the session. */
export function PaymentForm() {
  const [session, setSession] = useState<{
    clientSecret: string;
    amount: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFieldErrors({});
    setFormError("");

    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));

    try {
      const res = await fetch("/api/payments/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email: String(data.get("email") ?? ""),
          reference: String(data.get("reference") ?? ""),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setFieldErrors(json.fields ?? {});
        setFormError(json.error ?? "We could not start the payment.");
        setSubmitting(false);
        return;
      }

      setSession({ clientSecret: json.data.clientSecret, amount });
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection or call us instead."
      );
    }
    setSubmitting(false);
  }

  if (!stripePromise) {
    return (
      <ErrorBanner>
        Online payments are not configured yet. Please call{" "}
        {site.phoneDisplay} to pay your invoice.
      </ErrorBanner>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-[15px] text-body">
          Paying{" "}
          <span className="font-semibold text-strong tabular-nums">
            ${session.amount.toFixed(2)}
          </span>
          .{" "}
          <button
            type="button"
            onClick={() => setSession(null)}
            className="font-medium text-brand underline underline-offset-4"
          >
            Change amount
          </button>
        </p>

        <CheckoutElementsProvider
          stripe={stripePromise}
          options={{
            clientSecret: session.clientSecret,
            // Stripe renders its fields in an iframe, so it cannot read the
            // page's CSS variables - the palette is handed over explicitly.
            elementsOptions: {
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#1a3b66",
                  borderRadius: "8px",
                  fontFamily: "system-ui, sans-serif",
                },
              },
            },
          }}
        >
          <CardStep amount={session.amount} />
        </CheckoutElementsProvider>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {formError ? <ErrorBanner>{formError}</ErrorBanner> : null}

      <TextField
        id="amount"
        label="Amount (USD)"
        type="number"
        inputMode="decimal"
        min={5}
        max={10000}
        step="0.01"
        required
        hint="Enter the amount shown on your invoice or quoted by our office."
        error={fieldErrors.amount}
      />

      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        hint="Your receipt is sent here."
        error={fieldErrors.email}
      />

      <TextField
        id="reference"
        label="Invoice or patient reference"
        hint="Optional, but it helps us match your payment to your account."
        error={fieldErrors.reference}
      />

      <div className="flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner />
              Preparing payment
            </>
          ) : (
            "Continue to card details"
          )}
        </Button>
      </div>
    </form>
  );
}
