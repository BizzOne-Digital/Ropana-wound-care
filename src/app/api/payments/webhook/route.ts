import { dbConnect } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { fail, ok, serverError } from "@/lib/api";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe is the only source of truth for a completed payment. The raw body is
 * required for signature verification, so it is read as text before parsing.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return fail("Not authorised.", 401);

  const body = await request.text();

  // Signature verification is a pure HMAC check, so it needs the signing
  // secret only - never the API key.
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    // Anyone can POST here; an unverified payload is rejected, not logged.
    return fail("Invalid signature.", 400);
  }

  if (event.type !== "checkout.session.completed") return ok({ ignored: true });

  const session = event.data.object as Stripe.Checkout.Session;
  // A completed session is not always a paid one - async methods settle later.
  if (session.payment_status !== "paid") return ok({ ignored: true });

  try {
    await dbConnect();
    // Upsert on the session id, so Stripe's retries cannot double-record.
    await Payment.updateOne(
      { stripeId: session.id },
      {
        $setOnInsert: {
          stripeId: session.id,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          email: session.customer_details?.email ?? "",
          reference: session.metadata?.reference ?? "",
        },
      },
      { upsert: true }
    );
    return ok({ recorded: true });
  } catch (error) {
    // A 500 tells Stripe to retry, which the upsert above makes safe.
    return serverError("payments.webhook", error);
  }
}
