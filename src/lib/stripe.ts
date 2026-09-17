import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client. The secret key never leaves this module, and the
 * client is created lazily so a missing key surfaces as a handled 500 on the
 * payment route rather than crashing an unrelated page at import time.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example)."
    );
  }
  return new Stripe(key);
}
