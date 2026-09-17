import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { EmptyState, ErrorNotice } from "@/components/ui/States";
import { formatDateTime } from "@/lib/format";
import { listPayments } from "@/lib/admin-data";
import type { AdminPayment } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Payments" };

/** Read-only: payments are written by Stripe's webhook, never by hand. */
export default async function AdminPaymentsPage() {
  let payments: AdminPayment[] = [];
  let loadError = false;

  try {
    payments = await listPayments();
  } catch (error) {
    console.error("[admin.payments]", error);
    loadError = true;
  }

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <AdminPageHeader
        title="Payments"
        description="Completed Stripe payments, recorded from Stripe's webhook once the card has actually cleared."
      />

      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          body="Payments made through the website payment page appear here once Stripe confirms them."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {payments.map((payment) => (
            <li
              key={payment._id}
              className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-strong tabular-nums">
                  {(payment.amount / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: payment.currency.toUpperCase(),
                  })}
                </p>
                <dl className="mt-2 grid gap-x-8 gap-y-1 text-[14px] sm:grid-cols-2">
                  <div className="flex min-w-0 gap-2">
                    <dt className="text-muted">Email</dt>
                    <dd className="min-w-0">
                      {payment.email ? (
                        <a
                          href={`mailto:${payment.email}`}
                          className="block truncate text-brand hover:underline"
                        >
                          {payment.email}
                        </a>
                      ) : (
                        <span className="text-muted">Not provided</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted">Reference</dt>
                    <dd className="text-body">
                      {payment.reference || (
                        <span className="text-muted">None</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted">Paid</dt>
                    <dd className="text-body">
                      {formatDateTime(payment.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="shrink-0 text-[12px] text-muted">
                <span className="sr-only">Stripe reference </span>
                {payment.stripeId}
              </p>
            </li>
          ))}
        </ul>
      )}

      {payments.length > 0 ? (
        <p className="mt-6 text-[14px] text-body">
          {payments.length} payment{payments.length === 1 ? "" : "s"} shown,
          totalling{" "}
          <span className="font-semibold text-strong tabular-nums">
            {(total / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          .
        </p>
      ) : null}
    </>
  );
}
