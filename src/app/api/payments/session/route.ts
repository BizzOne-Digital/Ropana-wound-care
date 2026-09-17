import { z } from "zod";
import { ok, parseBody, serverError } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The patient types the amount their invoice says, so it is bounded here as
 * well as in the form. Stripe works in cents, which also keeps float rounding
 * out of the money path.
 */
const paymentSchema = z.object({
  amount: z
    .number()
    .finite("Enter a valid amount.")
    .min(5, "Minimum payment is $5.")
    .max(10000, "For payments over $10,000 please call the office."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  reference: z.string().trim().max(60).optional().or(z.literal("")),
});

/**
 * Public: open a Checkout Session in `elements` mode and hand back only its
 * client secret. That secret drives this one session and nothing else, so it
 * is safe in the browser; the API key never is.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, paymentSchema);
  if (!parsed.success) return parsed.response;

  const { amount, email, reference } = parsed.data;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      // Stripe's own fields render inside our page rather than on a hosted
      // page of theirs, so the patient never leaves the site to pay.
      ui_mode: "elements",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${site.name} payment`,
              ...(reference ? { description: `Reference: ${reference}` } : {}),
            },
          },
        },
      ],
      customer_email: email,
      metadata: { reference: reference || "" },
      // The amount is fixed here; the browser only ever confirms the session
      // it is given.
      return_url: `${site.url}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return serverError("payments.session", "no client secret");
    }
    return ok({ clientSecret: session.client_secret });
  } catch (error) {
    return serverError("payments.session", error);
  }
}
